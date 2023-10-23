require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { winstonLogger } = require('./loggerController');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const searchIndexName = 'gw-docs';

// Every keyword field in Elasticsearch is included in the filter list
async function getKeywordFields() {
  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });
  const mappings = mappingResults.body[searchIndexName].mappings.properties;
  return Object.keys(mappings).filter(
    (key) => mappings[key].type === 'keyword'
  );
}

// Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
// values that contain commas are wrapped in quotes by the getDocumentMetadataById function in configController.js
// Therefore, filter values must be parsed here taking quotes into account.
function getFiltersFromUrl(filterFields, queryParams) {
  try {
    let filtersFromUrl = {};
    for (const param in queryParams) {
      if (filterFields.includes(param)) {
        const paramValues = decodeURI(queryParams[param]);
        const matches = paramValues.matchAll(/"(.+?)"/g);
        let quotedParamValues = [];
        let nonQuotedParamValues = paramValues;
        for (const match of matches) {
          nonQuotedParamValues = nonQuotedParamValues.replace(match[0], ''); // Remove the entire quoted string from params
          quotedParamValues.push(match[1]); // Add the string without the quotes to the list of quoted parameters
        }
        const allParamValues = [
          ...quotedParamValues,
          ...nonQuotedParamValues.split(','),
        ].filter((v) => v);
        filtersFromUrl[param] = allParamValues;
      }
    }
    return filtersFromUrl;
  } catch (err) {
    winstonLogger.error(
      `Problem getting filters from URL
          FILTER FIELDS: ${filterFields}
          QUERY PARAMS: ${queryParams}
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function getAllowedFilterValues(fieldName, query) {
  try {
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
      (bucket) => {
        return { label: bucket.key, doc_count: bucket.doc_count };
      }
    );
  } catch (err) {
    winstonLogger.error(
      `Problem getting allowed filter values for 
          fieldName: ${fieldName}, 
          query: ${query}, 
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function getFilters(query, filterFields, urlFilters) {
  try {
    let filterNamesAndValues = [];
    for (const field of filterFields) {
      const queryWithFiltersFromUrl = JSON.parse(JSON.stringify(query));
      let queryFilters = queryWithFiltersFromUrl.bool.hasOwnProperty('filter')
        ? [...queryWithFiltersFromUrl.bool.filter]
        : [];
      for (const [key, value] of Object.entries(urlFilters)) {
        if (key !== field) {
          queryFilters.push({
            terms: {
              [key]: value,
            },
          });
        }
      }
      if (field === 'version') {
        queryFilters.push({
          term: {
            platform: 'Self-managed',
          },
        });
      }
      if (field === 'release') {
        queryFilters.push({
          term: {
            platform: 'Cloud',
          },
        });
      }
      queryWithFiltersFromUrl.bool.filter = queryFilters;
      const allowedFilterValues = await getAllowedFilterValues(
        field,
        queryWithFiltersFromUrl
      );

      const urlFilterValues = urlFilters.hasOwnProperty(field)
        ? urlFilters[field]
        : [];
      const allFilterValues = Array.from(
        new Set([
          ...allowedFilterValues?.map((v) => v.label),
          ...urlFilterValues,
        ])
      );
      const filterValuesObjects = allFilterValues?.map((value) => {
        return {
          label: value,
          doc_count:
            allowedFilterValues.find((v) => v.label === value)?.doc_count || 0,
          checked: !!urlFilterValues.find((v) => v === value),
        };
      });
      filterNamesAndValues.push({
        name: field,
        values: filterValuesObjects,
      });
    }

    return filterNamesAndValues;
  } catch (err) {
    winstonLogger.error(
      `Problem getting filters for 
          QUERY: ${JSON.stringify(query)},    
          FILTER FIELDS: ${filterFields},  
          URL FILTERS: ${JSON.stringify(urlFilters)},
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function runSearch(query, startIndex, resultsPerPage, urlFilters) {
  try {
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

    const highlightParameters = {
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
    };

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
            highlight: highlightParameters,
          },
          max_concurrent_group_searches: 4,
        },
        highlight: highlightParameters,
      },
    });

    return {
      numberOfHits: searchResultsCount.body.aggregations.totalHits.doc_count,
      numberOfCollapsedHits:
        searchResultsCount.body.aggregations.totalHits.totalCollapsedHits.value,
      hits: searchResults.body.hits.hits,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem running search for  
          query: ${query},    
          startIndex: ${startIndex},  
          resultsPerPage: ${resultsPerPage},
          urlFilters: ${urlFilters},
          ERROR: ${JSON.stringify(err)}`
    );
  }
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

function sortObjectsFromNewestToOldest(objectsList) {
  try {
    return objectsList
      .sort(function (a, b) {
        const verNum = (versions) =>
          versions[0]
            .split('.')
            .map((n) => +n + 100000)
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
  } catch (err) {
    winstonLogger.error(`Problem sorting objects from newest to oldest
      objectList: ${JSON.stringify(objectsList)}`);
  }
}

async function prepareResultsToDisplay(searchResults) {
  return searchResults.hits.map((result) => {
    const docScore = result._score;
    let mainResult = result;
    const innerHits = result.inner_hits.same_title.hits.hits;
    const innerHitsMatchingDocScore = innerHits.filter(
      (h) => h._score === docScore
    );

    // If there are multiple inner hits with the same score as the main result,
    // we want to display the inner hit with the newest version number.
    if (innerHitsMatchingDocScore.length > 0) {
      mainResult = sortObjectsFromNewestToOldest(innerHitsMatchingDocScore)[0];
    }

    const innerHitsWithoutMainResult = innerHits.filter(
      (h) => h._id !== mainResult._id
    );

    const doc = mainResult._source;
    const highlight = mainResult.highlight;

    const highlightTitleKey = Object.getOwnPropertyNames(highlight).filter(
      (k) => k.startsWith('title') && !k.startsWith('title.raw')
    )[0];

    const highlightBodyKey = Object.getOwnPropertyNames(highlight).filter((k) =>
      k.startsWith('body')
    )[0];
    const bodyBlurb = doc.body ? doc.body.substr(0, 300) + '...' : '';

    // The "number_of_fragments" parameter is set to "0' for the title field.
    // So no fragments are produced, instead the whole content of the field is returned
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
    const regExpResults = Array.from(allText.matchAll(regExp));
    const uniqueHighlightTerms = Array.from(
      new Set(regExpResults.map((r) => r[1].toLowerCase()))
    )
      .sort(function (a, b) {
        return b.length - a.length;
      })
      .join(',');

    const sortedInnerHits = sortObjectsFromNewestToOldest(
      innerHitsWithoutMainResult
    );

    const innerHitsToDisplay = sortedInnerHits.map(
      (innerHit) => innerHit._source
    );

    const hitsWithUniqueUrls = [];
    for (const hit of innerHitsToDisplay) {
      if (!hitsWithUniqueUrls.find((h) => h.href === hit.href)) {
        hitsWithUniqueUrls.push(hit);
      }
    }

    return {
      ...doc,
      score: docScore,
      title: sanitizeTagNames(titleText),
      titlePlain: sanitizeTagNames(doc.title),
      body: sanitizeTagNames(bodyText),
      bodyPlain: sanitizeTagNames(bodyBlurb),
      innerHits: hitsWithUniqueUrls,
      uniqueHighlightTerms: uniqueHighlightTerms,
    };
  });
}

async function searchController(req, res, next) {
  try {
    const urlQueryParameters = req.query;
    const searchPhrase = urlQueryParameters.q
      ? decodeURI(urlQueryParameters.q)
      : '';
    const resultsPerPage = urlQueryParameters.pagination || 10;
    const currentPage = urlQueryParameters.page || 1;
    const startIndex = resultsPerPage * (currentPage - 1);
    const userInfo = res.locals.userInfo;
    const requestIsAuthenticated = userInfo.isLoggedIn;
    const hasGuidewireEmail = userInfo.hasGuidewireEmail;
    const keywordFields = await getKeywordFields();
    const filtersFromUrl = getFiltersFromUrl(keywordFields, urlQueryParameters);

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
    } else if (requestIsAuthenticated && !hasGuidewireEmail) {
      queryBody.bool.filter = [
        {
          term: {
            internal: false,
          },
        },
      ];
    }

    const filters = await getFilters(queryBody, keywordFields, filtersFromUrl);

    const results = await runSearch(
      queryBody,
      startIndex,
      resultsPerPage,
      filtersFromUrl
    );

    const resultsToDisplay = await prepareResultsToDisplay(
      results,
      keywordFields
    );

    if (req.query.rawJSON === 'true') {
      return {
        status: 200,
        body: resultsToDisplay,
      };
    } else {
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
        filters: filters,
        filtersFromUrl: filtersFromUrl,
        requestIsAuthenticated: requestIsAuthenticated,
      };
      return {
        status: 200,
        body: searchData,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Problem performing search
          QUERY: ${JSON.stringify(req.query)}
          ERROR: ${JSON.stringify(err)}`
    );
    next(err);
  }
}

module.exports = searchController;
