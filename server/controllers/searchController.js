require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { isRequestAuthenticated } = require('./authController');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const searchIndexName = 'gw-docs';

async function getFieldMappings() {
  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });
  return mappingResults.body[searchIndexName].mappings.properties;
}

function getFiltersFromUrl(fieldMappings, queryParams) {
  let filtersFromUrl = {};
  for (const param in queryParams) {
    if (fieldMappings[param] && fieldMappings[param].type === 'keyword') {
      filtersFromUrl[param] = decodeURI(queryParams[param]).split(',');
    }
  }
  return filtersFromUrl;
}

async function getAllowedFilterValues(fieldName, query) {
  const requestBody = {
    index: searchIndexName,
    size: 0,
    body: {
      aggs: {
        allowedForField: {
          filter: query,
          aggs: {
            keywordFilter: {
              terms: {
                field: fieldName,
                size: 100,
              },
            },
          },
        },
      },
    },
  };

  const result = await elasticClient.search(requestBody);

  return result.body.aggregations.allowedForField.keywordFilter.buckets.map(
    bucket => {
      return { label: bucket.key, doc_count: bucket.doc_count };
    }
  );
}

async function getFilters(query, fieldMappings, urlFilters) {
  let filterNamesAndValues = [];
  for (const key in fieldMappings) {
    if (fieldMappings[key].type === 'keyword') {
      const allowedFilterValues = await getAllowedFilterValues(key, query);
      const filterValues = allowedFilterValues.map(value => {
        return {
          label: value.label,
          doc_count: value.doc_count,
          checked: urlFilters[key]?.includes(value.label),
        };
      });
      filterNamesAndValues.push({
        name: key,
        values: filterValues,
      });
    }
  }

  let filtersWithUpdatedStatusAndCount = [];
  for (const f of filterNamesAndValues) {
    const queryWithFiltersFromUrl = JSON.parse(JSON.stringify(query));
    let queryFilters = queryWithFiltersFromUrl.bool.hasOwnProperty('filter')
      ? [...queryWithFiltersFromUrl.bool.filter]
      : [];
    for (const [key, value] of Object.entries(urlFilters)) {
      if (key !== f.name) {
        queryFilters.push({
          terms: {
            [key]: value,
          },
        });
      }
    }
    queryWithFiltersFromUrl.bool.filter = queryFilters;
    const allowedFilterValues = await getAllowedFilterValues(f.name, query);
    const updatedFilterValues = f.values.map(value => {
      const updatedDataForValue = allowedFilterValues.find(
        v => v.label === value.label
      );
      return {
        label: value.label,
        doc_count: updatedDataForValue ? updatedDataForValue.doc_count : 0,
        checked: value.checked,
      };
    });
    filtersWithUpdatedStatusAndCount.push({
      name: f.name,
      values: updatedFilterValues,
    });
  }

  return filtersWithUpdatedStatusAndCount;
}

async function runSearch(query, startIndex, resultsPerPage, urlFilters) {
  const queryWithFiltersFromUrl = JSON.parse(JSON.stringify(query));
  if (urlFilters) {
    let queryFilters = queryWithFiltersFromUrl.bool.hasOwnProperty('filter')
      ? [...queryWithFiltersFromUrl.bool.filter]
      : [];
    for (const [key, value] of Object.entries(urlFilters)) {
      queryFilters.push({
        terms: {
          [key]: value,
        },
      });
    }
    queryWithFiltersFromUrl.bool.filter = queryFilters;
  }

  const searchResultsCount = await elasticClient.search({
    index: searchIndexName,
    size: 0,
    body: {
      aggs: {
        totalHits: {
          filter: query,
          aggs: {
            totalCollapsedHits: {
              cardinality: {
                field: 'title.raw',
                precision_threshold: 40000,
              },
            },
          },
        },
      },
    },
  });

  const searchResults = await elasticClient.search({
    index: searchIndexName,
    from: startIndex,
    size: resultsPerPage,
    body: {
      query: query,
      collapse: {
        field: 'title.raw',
        inner_hits: {
          name: 'same_title',
          size: 20,
          sort: [{ version: 'desc' }],
        },
        max_concurrent_group_searches: 4,
      },
      highlight: {
        fragment_size: 0,
        fields: [
          {
            'title*': {
              number_of_fragments: 0,
            },
          },
          { 'body*': {} },
        ],
        pre_tags: ['<span class="searchResultHighlight highlighted">'],
        post_tags: ['</span>'],
      },
    },
  });

  const numberOfCollapsedHits =
    searchResultsCount.body.aggregations.totalHits.totalCollapsedHits.value;

  return {
    numberOfCollapsedHits:
      numberOfCollapsedHits <= 10000 ? numberOfCollapsedHits : 10000,
    hits: searchResults.body.hits.hits,
  };
}

async function searchController(req, res, next) {
  try {
    const urlQueryParameters = req.query;
    const searchPhrase = urlQueryParameters.q
      ? decodeURI(urlQueryParameters.q)
      : '';
    const resultsPerPage = req.query.pagination || 10;
    const currentPage = req.query.page || 1;
    const startIndex = resultsPerPage * (currentPage - 1);
    const requestIsAuthenticated = !!(
      process.env.ENABLE_AUTH === 'no' || (await isRequestAuthenticated(req))
    );
    const mappings = await getFieldMappings();
    const filtersFromUrl = getFiltersFromUrl(mappings, urlQueryParameters);

    const queryBody = {
      bool: {
        must: {
          simple_query_string: {
            query: searchPhrase,
            fields: ['title^12', 'body'],
            quote_field_suffix: '.exact',
            default_operator: 'AND',
          },
        },
      },
    };

    if (!requestIsAuthenticated) {
      queryBody.bool.filter = [
        {
          term: {
            public: true,
          },
        },
      ];
    }

    const displayOrder = [
      'platform',
      'product',
      'version',
      'subject',
      'doc_title',
    ];

    const filters = await getFilters(queryBody, mappings, filtersFromUrl);

    const arrangedFilters = [];
    for (const key of displayOrder) {
      if (filters.some(f => f.name === key)) {
        arrangedFilters.push(filters.find(f => f.name === key));
      }
    }

    const results = await runSearch(
      queryBody,
      startIndex,
      resultsPerPage,
      filtersFromUrl
    );

    const resultsToDisplay = results.hits.map(result => {
      const doc = result._source;
      const highlight = result.highlight;
      let docTags = [];
      for (const key of displayOrder) {
        if (doc[key]) {
          docTags.push(doc[key]);
        }
      }

      const highlightTitleKey = Object.getOwnPropertyNames(
        highlight
      ).filter(k => k.startsWith('title'))[0];

      const highlightBodyKey = Object.getOwnPropertyNames(highlight).filter(k =>
        k.startsWith('body')
      )[0];
      const bodyBlurb = doc.body ? doc.body.substr(0, 300) + '...' : '';

      //The "number_of_fragments" parameter is set to "0' for the title field.
      //So no fragments are produced, instead the whole content of the field is returned
      // as the first element of the array, and matches are highlighted.
      const titleText = highlightTitleKey
        ? highlight[highlightTitleKey][0]
        : doc.title;
      const bodyText = highlightBodyKey
        ? highlight[highlightBodyKey].join(' [...] ')
        : bodyBlurb;
      const regExp = new RegExp(
        '<span class="searchResultHighlight.*?">(.*?)</span>',
        'g'
      );
      const allText = titleText + bodyText;
      const regExpResults = [...allText.matchAll(regExp)];
      const uniqueHighlightTerms = [
        ...new Set(regExpResults.map(r => r[1].toLowerCase())),
      ]
        .sort(function(a, b) {
          return b.length - a.length;
        })
        .join(',');

      return {
        href: doc.href,
        score: result._score,
        title: titleText,
        titlePlain: doc.title,
        version: doc.version.join(', '),
        body: bodyText,
        bodyPlain: bodyBlurb,
        docTags: docTags,
        inner_hits: result.inner_hits.same_title.hits.hits,
        uniqueHighlightTerms: uniqueHighlightTerms,
      };
    });

    const retrievedTags = [];

    resultsToDisplay.forEach(result => {
      result.docTags.forEach(tag => {
        if (!retrievedTags.includes(tag)) {
          retrievedTags.push(tag);
        }
      });
    });

    if (req.query.rawJSON) {
      res.send(resultsToDisplay);
    } else {
      const searchData = {
        query: searchPhrase,
        searchResults: resultsToDisplay,
        totalNumOfResults: results.numberOfCollapsedHits,
        currentPage: currentPage,
        pages: Math.ceil(results.numberOfCollapsedHits / resultsPerPage),
        resultsPerPage: resultsPerPage,
        filters: arrangedFilters,
        userContext: req.userContext,
      };
      res.render('search', searchData);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = searchController;
