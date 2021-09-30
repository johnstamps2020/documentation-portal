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
    const allowedFilterValues = await getAllowedFilterValues(
      f.name,
      queryWithFiltersFromUrl
    );
    let updatedFilterValues = [];
    for (const value of f.values) {
      const updatedDataForValue = allowedFilterValues.find(
        v => v.label === value.label
      );
      if (updatedDataForValue) {
        updatedFilterValues.push({
          label: value.label,
          doc_count: updatedDataForValue.doc_count,
          checked: value.checked,
        });
      }
    }

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
          filter: queryWithFiltersFromUrl,
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
      query: queryWithFiltersFromUrl,
      collapse: {
        field: 'title.raw',
        inner_hits: {
          name: 'same_title',
          size: 1000,
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

  return {
    numberOfHits: searchResultsCount.body.aggregations.totalHits.doc_count,
    numberOfCollapsedHits:
      searchResultsCount.body.aggregations.totalHits.totalCollapsedHits.value,
    hits: searchResults.body.hits.hits,
  };
}

function sanitizeTagNames(textToSanitize) {
  const sanitizedText1 = textToSanitize.replace(
    new RegExp('<((?:(?!span).)*?)>', 'g'),
    '&lt;$1&gt;'
  );
  const sanitizedText2 = sanitizedText1.replace(
    new RegExp('<(<.*?>)>', 'g'),
    '&lt;$1&gt;'
  );
  const sanitizedText3 = sanitizedText2.replace(
    new RegExp('<((?:(?!span).)*?)(-|\\s)', 'g'),
    '&lt;$1$2'
  );
  const sanitizedText4 = sanitizedText3.replace(
    new RegExp('(<.*?>\\S)>', 'g'),
    '$1&gt;'
  );
  const sanitizedText5 = sanitizedText4.replace(
    new RegExp('<([^>]+$)', 'g'),
    '&lt;$1'
  );
  return sanitizedText5;
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

      const sortedInnerHits = result.inner_hits.same_title.hits.hits
        .sort(function(a, b) {
          const verNum = versions =>
            versions[0]
              .split('.')
              .map(n => +n + 100000)
              .join('.');
          const verNumA = verNum(a._source.version);
          const verNumB = verNum(b._source.version);
          let comparison = 0;
          if (verNumA > verNumB) {
            comparison = 1;
          } else if (verNumA < verNumB) {
            comparison = -1;
          }
          return comparison;
        })
        .reverse();

      let innerHitsToDisplay = [];
      for (const innerHit of sortedInnerHits) {
        const hitLabel = innerHit._source.title;
        const hitHref = innerHit._source.href;
        const hitPlatform = innerHit._source.platform;
        const hitProduct = innerHit._source.product;
        const hitVersion = innerHit._source.version;
        if (hitHref !== doc.href) {
          innerHitsToDisplay.push({
            label: hitLabel,
            href: hitHref,
            tags: [...hitProduct, ...hitPlatform, ...hitVersion],
          });
        }
      }

      let hitsWithUniqueUrls = [];
      for (const hit of innerHitsToDisplay) {
        if (!hitsWithUniqueUrls.find(h => h.href === hit.href)) {
          hitsWithUniqueUrls.push(hit);
        }
      }

      return {
        href: doc.href,
        score: result._score,
        title: sanitizeTagNames(titleText),
        titlePlain: sanitizeTagNames(doc.title),
        version: doc.version.join(', '),
        body: sanitizeTagNames(bodyText),
        bodyPlain: sanitizeTagNames(bodyBlurb),
        docTags: docTags,
        innerHits: hitsWithUniqueUrls,
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
      const missingFilters = [];
      for (const [urlFilterName, urlFilterValues] of Object.entries(
        filtersFromUrl
      )) {
        for (const f of arrangedFilters) {
          if (urlFilterName === f.name) {
            const filterValues = f.values.map(v => v.label);
            const missingFilterValues = [];
            for (const value of urlFilterValues) {
              if (!filterValues.includes(value)) {
                missingFilterValues.push({
                  label: value,
                  doc_count: 0,
                  checked: true,
                });
              }
            }
            if (missingFilterValues.length > 0) {
              missingFilters.push({
                name: f.name,
                values: missingFilterValues,
              });
            }
          }
        }
      }

      let extendedArrangedFilters = [];
      if (missingFilters.length > 0) {
        for (const f of arrangedFilters) {
          for (const mf of missingFilters) {
            if (f.name === mf.name) {
              extendedArrangedFilters.push({
                name: f.name,
                values: [...f.values, ...mf.values],
              });
            } else {
              extendedArrangedFilters.push(f);
            }
          }
        }
      } else {
        extendedArrangedFilters = arrangedFilters;
      }

      const checkedFilterValues = [];
      for (const f of filters) {
        const checkedValues = f.values
          .filter(filterValue => filterValue.checked)
          .map(v => v.label);
        if (checkedValues.length > 0) {
          checkedFilterValues.push(...checkedValues);
        }
      }
      const allFilterValuesFromUrl = Object.values(filtersFromUrl).flat();
      const inactiveFilterValuesFromUrl = allFilterValuesFromUrl.filter(
        v => !checkedFilterValues.includes(v)
      );
      const searchData = {
        searchPhrase: searchPhrase,
        searchResults: resultsToDisplay,
        totalNumOfResults: results.numberOfHits,
        totalNumOfCollapsedResults: results.numberOfCollapsedHits,
        currentPage: currentPage,
        // We limited the number of pages because the search results page crashes when there are over 10000 hits
        // and you try to display a page for results from 10000 upward
        pages: Math.ceil(
          (results.numberOfCollapsedHits <= 10000
            ? results.numberOfCollapsedHits
            : 10000) / resultsPerPage
        ),
        resultsPerPage: resultsPerPage,
        filters: extendedArrangedFilters,
        filtersFromUrl: filtersFromUrl,
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
