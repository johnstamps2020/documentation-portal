require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const searchIndexName = 'gw-docs';

const getAllowedFilterValues = async function(fieldName, query) {
  const requestBody = {
    index: searchIndexName,
    size: 0,
    body: {
      aggs: {
        allowedForField: {
          filter: query,
          aggs: {
            keywordFilter: { terms: { field: fieldName, size: 50 } },
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
};

const runFilteredSearch = async (
  searchPhrase,
  urlParams,
  startIndex,
  resultsPerPage,
  isLoggedIn
) => {
  let queryBody = {
    bool: {
      must: {
        multi_match: {
          query: searchPhrase,
          fuzziness: 'AUTO',
          type: 'best_fields',
          minimum_should_match: '90%',
          fields: ['title^12', 'body'],
        },
      },
    },
  };

  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });

  const mappings = mappingResults.body[searchIndexName].mappings.properties;

  let selectedFilters = [];

  if (!isLoggedIn) {
    selectedFilters.push({
      term: {
        public: true,
      },
    });
  }

  for (const param in urlParams) {
    if (mappings[param] && mappings[param].type == 'keyword') {
      const values = decodeURI(urlParams[param]).split(',');
      const queryFilter = {
        terms: {
          [param]: values,
        },
      };
      selectedFilters.push(queryFilter);
    }
  }

  if (selectedFilters.length > 0) {
    queryBody.bool.filter = selectedFilters;
  }

  let filtersWithValues = [];
  for (const key in mappings) {
    if (mappings[key].type === 'keyword') {
      const allowedFilterValues = await getAllowedFilterValues(key, queryBody);
      const filterValuesWithStates = allowedFilterValues.map(value => {
        const checked = decodeURI(urlParams[key])
          .split(',')
          .includes(value.label);
        return {
          label: value.label,
          doc_count: value.doc_count,
          checked: checked,
        };
      });
      filtersWithValues.push({
        name: key,
        values: filterValuesWithStates,
      });
    }
  }

  const searchResults = await elasticClient.search({
    index: searchIndexName,
    from: startIndex,
    size: resultsPerPage,
    body: {
      query: queryBody,
      collapse: {
        field: 'title.keyword',
        inner_hits: {
          name: 'same_title',
          size: 20,
          sort: [{ version: 'desc' }],
        },
        max_concurrent_group_searches: 4,
      },
    },
  });

  return {
    numberOfHits: searchResults.body.hits.total.value,
    hits: searchResults.body.hits.hits,
    filters: filtersWithValues,
  };
};

const searchController = async (req, res, next) => {
  try {
    const searchPhrase = decodeURI(req.query.q);
    let resultsPerPage = 10;
    if (req.query.pagination) {
      resultsPerPage = req.query.pagination;
    }
    const currentPage = req.query.page || 1;
    const startIndex = resultsPerPage * (currentPage - 1);
    const results = await runFilteredSearch(
      searchPhrase,
      req.query,
      startIndex,
      resultsPerPage,
      req.isAuthenticated() || process.env.ENABLE_AUTH === 'no'
    );

    const filters = results.filters;

    const totalNumOfResults = results.numberOfHits;

    const resultsToDisplay = results.hits.map(result => {
      const doc = result._source;
      let docTags = [];
      for (const key in doc) {
        if (filters.some(filter => filter.name === key)) {
          docTags.push(doc[key]);
        }
      }

      const getBlurb = body => {
        if (body) {
          return body.substr(0, 300) + '...';
        }
        return '';
      };

      return {
        href: doc.href,
        score: result._score,
        title: doc.title,
        version: doc.version.join(', '),
        body: getBlurb(doc.body),
        docTags: docTags,
        inner_hits: result.inner_hits.same_title.hits.hits,
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
      res.render('search', {
        query: searchPhrase,
        currentPage: currentPage,
        pages: Math.ceil(totalNumOfResults / resultsPerPage),
        totalNumOfResults: totalNumOfResults,
        resultsPerPage: resultsPerPage,
        searchResults: resultsToDisplay,
        filters: filters,
        userContext: req.userContext,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = searchController;
