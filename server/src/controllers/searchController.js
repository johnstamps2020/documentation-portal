require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { winstonLogger } = require('./loggerController');
const { getAllEntities } = require('./configController');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const searchIndexName = 'gw-docs-semantic';
const fragmentSize = 300;

// Every keyword field in Elasticsearch is included in the filter list
async function getKeywordFields() {
  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });
  const mappings = mappingResults[searchIndexName].mappings.properties;
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

    return result.aggregations.allowedForField.keywordFilter.buckets.map(
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

// TODO: This function is a temporary solution. We need to align the data model in Elasticsearch
//  with the database data model to be able to filter out values in a more flexible way.
async function validateFilterValuesAgainstDb(req, res, searchFilters) {
  const validatedFilters = [];
  const filterFieldsToBeValidated = ['version', 'release'];
  for (const searchFilter of searchFilters) {
    if (filterFieldsToBeValidated.includes(searchFilter.name)) {
      const reqWithParams = {
        ...req,
        params: {
          repo: searchFilter.name,
        },
      };
      const response = await getAllEntities(reqWithParams, res);
      if (response.status === 200) {
        const filterValuesFromDb = response.body.map((v) =>
          v.name.toLowerCase()
        );
        const updatedFilter = {
          name: searchFilter.name,
          values: searchFilter.values.filter((v) =>
            filterValuesFromDb.includes(v.label.toLowerCase())
          ),
        };
        validatedFilters.push(updatedFilter);
      } else {
        validatedFilters.push(searchFilter);
      }
    } else {
      validatedFilters.push(searchFilter);
    }
  }
  return validatedFilters;
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

    // - The highlighter type is set to "fvh" (fast vector highlighter). One of the benefits of this type is that
    //      it can combine matches from multiple fields into one result by means of the "matched_fields" property).
    // - The title and body fields, including the .exact subfields, use term vectors,
    //      that is, "term_vector" is set to "with_positions_offsets" in the field mapping. Using term vectors
    //      increases the index size, but it's fast especially for large fields (> 1MB) and for highlighting multi-term
    //      queries like prefix or wildcard because it can access the dictionary of terms for each document.
    // - Title - number_of_fragments is set to 0 for this field
    //      so that instead of fragments, the entire field content is returned with highlights.
    // - Body - number_of_fragments is set to 5, highlighted fragments are as long as the body excerpt that is shown for a doc in results.
    //      Fragments are ordered by score.
    //      It seemed like a good idea to set the fragment size parameter to 0
    //      (no sentence splitting for sentences longer than the fragment size) but then it turned out that chunks
    //      of text from the body are sometimes not separated properly.
    //      For example, the content of a table is not separated from the section that follows it.
    //      Because of that, in the search result, the entire table content is provided in the excerpt
    //      because Elasticsearch treats the table content and the following section as one sentence.
    const highlightParameters = {
      type: 'fvh',
      fields: [
        {
          title: {
            number_of_fragments: 0,
            matched_fields: ['title', 'title.exact'],
          },
        },
        {
          body: {
            number_of_fragments: 5,
            order: 'score',
            fragment_size: fragmentSize,
            matched_fields: ['body', 'body.exact'],
          },
        },
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

    const vectorizedSearchPhrase = [
      1.16597101e-1, -1.61751062e-2, 7.2133027e-2, -1.11951537e-1,
      6.42219651e-3, 3.35433371e-2, -3.76729965e-2, -2.55014878e-2,
      8.83942656e-3, 3.64394598e-2, 2.05600969e-2, -6.13615513e-2,
      -4.47221808e-2, -3.63813597e-3, 6.66740388e-2, -6.35112748e-2,
      6.07822873e-2, -9.47677437e-3, 7.55074024e-2, 2.07440685e-2,
      7.36510055e-3, -5.66093065e-2, 1.95922311e-2, -7.5135842e-2,
      -6.83374237e-4, 1.28483335e-2, 3.67951095e-2, 7.22433254e-2,
      4.46558259e-2, 1.51448892e-2, -2.97821071e-2, 4.69294051e-3,
      -8.45117792e-2, -5.60565218e-2, 2.12755669e-2, -1.53878899e-2,
      1.88203976e-2, -9.60255712e-2, -6.13120645e-2, -4.75287363e-2,
      1.02017209e-1, 4.93082069e-2, -6.9972449e-3, 6.94206581e-2,
      -2.30429843e-2, -2.41685789e-2, 3.09684761e-2, 6.58689719e-3,
      1.16509229e-1, -1.15417346e-1, -4.43445984e-3, 2.33531781e-2,
      8.0194734e-2, -7.90837929e-2, 1.19222822e-2, -2.76737735e-2, 4.3771103e-2,
      9.61383358e-2, 7.38176629e-2, -1.62528958e-2, -2.5318725e-2,
      5.25340848e-2, -9.32461303e-3, 9.2322873e-3, -3.71312946e-2,
      -5.01153879e-2, -1.80450436e-2, 1.13674022e-1, 4.11189906e-2,
      -3.16796787e-2, -7.92236105e-2, -2.4349954e-2, 5.01820296e-2,
      1.11277485e-2, -9.52209234e-2, 1.02242071e-3, 6.2747458e-3,
      -8.31822678e-2, -2.77462769e-2, -3.97763215e-2, -2.68103797e-2,
      -5.66248409e-2, -9.68353301e-2, 2.18846872e-2, 2.59378571e-2,
      2.83641629e-2, 2.51312386e-2, 8.05448741e-3, 7.37130046e-2,
      -8.70674197e-3, 5.87925501e-2, 2.46586315e-2, -1.29490029e-2,
      -6.55716052e-3, 1.87550765e-2, 1.03527671e-2, 4.77292947e-2,
      4.98136282e-2, -2.89655477e-2, -2.79760617e-3, 3.13474275e-2,
      -3.7333861e-2, 5.7334587e-2, 3.81458923e-2, 5.20061888e-2, -1.17414938e-2,
      -3.53226215e-2, -4.5322448e-2, 7.3855266e-2, -4.21268977e-2,
      -5.2635245e-2, -3.673115e-2, -5.2699931e-2, 3.10104769e-2, 1.31086269e-2,
      6.0381107e-2, -9.81554296e-3, -5.86171113e-2, -9.66047198e-2,
      -1.64334048e-2, 1.58216767e-2, -1.30565703e-1, -5.03470823e-2,
      -1.60917453e-2, 3.25057246e-2, 1.41154248e-2, -1.95762655e-3,
      7.64071422e-31, 2.466272e-2, -2.66225319e-2, 5.51035479e-2, 1.41782025e-2,
      4.97743413e-2, -5.39760925e-2, 3.75931114e-2, 1.66784208e-2,
      -1.72162391e-2, 3.18380408e-2, -3.01575754e-2, -4.75365967e-2,
      -7.45359203e-3, -1.77632999e-2, 2.32168175e-2, 2.36489326e-2,
      -5.23875542e-2, -5.31543717e-2, 9.87222269e-2, 5.63052902e-3,
      2.10532118e-2, -1.46377951e-1, -4.24948372e-2, -5.69581464e-2,
      -1.31369354e-2, 4.33280542e-2, 5.10085076e-2, 4.30559367e-3, 1.2979871e-1,
      2.86226105e-2, 1.0759785e-1, -8.18132311e-2, -5.69754541e-2,
      3.87272574e-2, -7.31428936e-2, -4.17633206e-2, -5.49879707e-2,
      -2.98680924e-2, -3.54213431e-3, 1.98486634e-2, -2.15308229e-3,
      -5.42605203e-3, 3.92392427e-2, 1.29427649e-2, 1.17567331e-2,
      -9.66181457e-2, -3.19916978e-2, -6.07641824e-2, 1.11792892e-1,
      5.45525402e-2, -1.71590094e-2, -6.15665056e-2, 7.05060549e-3,
      2.93064378e-2, 5.42208217e-2, 5.88888526e-2, -5.39979152e-2,
      3.19261812e-2, 1.24959638e-2, -6.48759007e-2, -1.85071751e-2,
      -3.49099599e-2, -7.80235007e-2, 8.24882314e-2, 1.51036819e-2,
      8.20937976e-2, 2.14495305e-2, 8.40988662e-3, 6.81878701e-2,
      -7.12693203e-3, -6.50920495e-2, -1.18957059e-2, 1.95469186e-2,
      3.70289162e-2, 9.78229102e-3, 1.00009525e-2, -7.66287521e-2,
      -1.41161317e-2, -3.68438028e-2, 1.12037036e-4, 3.84636745e-2,
      3.01296301e-2, -5.7037171e-2, 4.79331389e-2, 7.45180994e-2, -3.6539014e-3,
      6.49966206e-3, 4.91939187e-2, 2.29503885e-2, 3.0500574e-2, -2.58558895e-2,
      -2.26414371e-2, 1.79252289e-2, -1.14507403e-3, -1.36831924e-1,
      -2.0505373e-33, 4.3089129e-2, 1.3583974e-2, -1.43433586e-2,
      -1.04274573e-2, -1.43307e-2, 2.49889735e-2, 1.43588148e-2, 4.7135219e-2,
      -2.83057876e-2, -1.96945183e-2, -1.76964507e-1, -1.33965649e-2,
      1.65093109e-1, 5.76462708e-2, -4.74085622e-2, 8.54475051e-2,
      2.33946294e-2, 3.80706154e-2, -1.83474291e-2, -1.52233168e-2,
      -1.07432753e-1, 1.86935347e-2, 6.94184825e-2, 1.72134917e-2,
      -2.24163495e-2, -5.68436347e-2, 4.02111337e-2, -2.7655255e-2,
      -5.71133122e-2, -5.32662347e-2, 1.94767024e-2, 4.45351377e-2,
      -5.46431281e-2, -5.48436902e-2, -6.20850548e-2, -5.91299613e-5,
      4.40388136e-2, -1.40745472e-2, 1.912269e-2, -3.3625681e-3, 8.07032287e-2,
      -3.83663699e-2, -1.7606359e-2, -2.22179983e-2, -9.00388286e-2,
      3.05372756e-3, 1.25928214e-2, -4.77037504e-2, -8.59638825e-2,
      1.22937979e-2, 1.66545082e-2, 8.80838558e-3, 3.6386054e-2, -3.84740792e-2,
      4.44455585e-3, 5.33562712e-2, 5.27464487e-2, 5.8583051e-2, -8.40930045e-2,
      5.24567217e-2, 5.2686438e-2, -5.17361164e-2, -8.70707631e-2,
      -3.7409611e-2, -1.94478482e-2, 7.80671984e-2, 3.71647105e-2,
      9.55177546e-2, 2.50032288e-3, -6.60597458e-2, -5.95150553e-2,
      -1.61837488e-2, -2.57328674e-2, -2.31480356e-2, -4.47462425e-2,
      -3.4623988e-2, -1.49680348e-2, -2.09510028e-2, 4.83438326e-3,
      -7.64077064e-3, 5.68939857e-2, 3.8946718e-2, -2.88448632e-2,
      -1.04007974e-1, -7.19388307e-4, 5.89873455e-3, -9.82304737e-2,
      5.50895073e-2, 6.53759316e-2, -2.72694584e-2, -4.94820774e-2,
      5.17550893e-2, -2.82615889e-2, 4.61700968e-2, -4.48559485e-2,
      -1.87875313e-33, 7.78687075e-2, 5.45221195e-3, 4.73550335e-2,
      6.31668568e-2, -7.71570355e-2, 1.26530826e-1, 4.07864973e-2,
      -2.74586002e-3, 2.65303683e-2, 2.62133572e-2, 3.55401933e-2,
      -5.23528047e-2, -6.0739778e-2, 9.8185122e-2, -1.44671984e-2,
      2.13675294e-2, -1.05263377e-2, 1.49225906e-1, 6.83785323e-3,
      -9.75248404e-3, 1.06893163e-2, 3.93518992e-2, -5.08229434e-3,
      6.13523982e-2, 1.60891302e-2, 2.84029953e-2, -1.78452972e-2,
      -2.58284807e-2, -4.4168774e-3, -9.9452287e-3, -4.05394211e-2,
      2.93156859e-2, -5.25074117e-2, 1.18227385e-3, -9.92130712e-2,
      2.32279468e-2, -6.49392828e-2, 8.04224312e-2, -1.70676992e-3,
      3.14483531e-2, -6.5466594e-3, 7.76525075e-3, -4.70474921e-2,
      -7.09465817e-2, 5.52409366e-2, 2.15324685e-2, -2.92395521e-3,
      -5.72465956e-2, 2.76085269e-2, 2.47885119e-2, 1.69364735e-2,
      -3.15927491e-2, 1.53256422e-2, -1.78542156e-2, 2.67513096e-2,
      8.08146447e-2, -6.86517283e-2, -8.49196166e-2, 7.94099458e-3,
      2.75107846e-2, -3.9455954e-2, 3.46186049e-2, -4.27670516e-2,
      5.07377312e-2,
    ];

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
            size: 100,
            highlight: highlightParameters,
          },
          max_concurrent_group_searches: 4,
        },
        highlight: highlightParameters,
      },
    });

    const vectorSearchResults = await elasticClient.search({
      index: searchIndexName,
      knn: {
        field: 'body_vector',
        query_vector: vectorizedSearchPhrase,
        k: 10,
        num_candidates: 100,
        filter: queryWithFiltersFromUrl.bool.filter,
      },
    });

    return {
      numberOfHits: searchResultsCount.aggregations.totalHits.doc_count,
      numberOfCollapsedHits:
        searchResultsCount.aggregations.totalHits.totalCollapsedHits.value,
      hits: searchResults.hits.hits,
      vectorHits: vectorSearchResults.hits.hits,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem running search for  
          query: ${query},    
          startIndex: ${startIndex},  
          resultsPerPage: ${resultsPerPage},
          urlFilters: ${urlFilters},
          ERROR: ${err}`
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

function getHighestScore(scores) {
  return Math.max(...scores);
}

function getHighestVersion(versions, numeric = false) {
  if (!versions || versions.length === 0) {
    return null;
  }

  if (versions.length === 1) {
    return versions[0];
  }

  if (numeric) {
    versions.sort(function (a, b) {
      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
  } else {
    versions.sort(function (a, b) {
      return a.localeCompare(b);
    });
  }

  return versions.reverse()[0];
}

function getUniqueResultsSortedByVersion(resultList) {
  const uniqueResults = [];
  for (const result of resultList) {
    if (!uniqueResults.find((r) => r._source.href === result._source.href)) {
      uniqueResults.push(result);
    }
  }
  uniqueResults
    .sort(function (a, b) {
      const highestScore = getHighestScore([a._score, b._score]);
      const releaseA = getHighestVersion(a._source.release);
      const releaseB = getHighestVersion(b._source.release);
      if (releaseA && releaseB) {
        if (releaseA === releaseB) {
          return highestScore;
        }
        return releaseA.localeCompare(releaseB);
      }
      const verNumA = getHighestVersion(a._source.version, true);
      const verNumB = getHighestVersion(b._source.version, true);
      if (verNumA === verNumB) {
        return highestScore;
      }
      return verNumA.localeCompare(verNumB, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    })
    .reverse();

  return uniqueResults;
}

async function prepareResultsToDisplay(searchResults) {
  return searchResults.hits.map((result) => {
    const innerHits = result.inner_hits.same_title.hits.hits;
    const allHits = [result, ...innerHits];
    const allHitsSortedFromLatest = getUniqueResultsSortedByVersion(allHits);
    const [topHit, ...otherHits] = allHitsSortedFromLatest;
    const mainResult = topHit._source;
    const mainResultScore = topHit._score;
    const mainResultHighlight = topHit.highlight;
    const mainResultTitle = mainResult.title;
    const mainResultBody = mainResult.body || '';
    const mainResultBodyFragment = mainResultBody.substring(0, fragmentSize);

    // The title field in the highlighter matches results from the title and title.exact fields.
    const highlightTitleKey = Object.getOwnPropertyNames(
      mainResultHighlight
    ).find((k) => k === 'title');

    // The body field in the highlighter matches results from the body and body.exact fields.
    const highlightBodyKey = Object.getOwnPropertyNames(
      mainResultHighlight
    ).find((k) => k === 'body');

    // The "number_of_fragments" parameter is set to "0' for the title field.
    // So no fragments are produced, instead the whole content of the field is returned
    // as the first element of the array, and matches are highlighted.
    const titleText = highlightTitleKey
      ? mainResultHighlight[highlightTitleKey][0]
      : mainResultTitle;
    // If there are highlights in the body, join all fragments to get a complete list of highlighted terms
    const bodyText = highlightBodyKey
      ? mainResultHighlight[highlightBodyKey].join(' ')
      : mainResultBodyFragment;
    const allText = titleText + bodyText;
    const regExp = new RegExp(
      '<span class="searchResultHighlight.*?">(.*?)</span>',
      'g'
    );
    const regExpResults = Array.from(allText.matchAll(regExp));
    const uniqueHighlightTerms = Array.from(
      new Set(regExpResults.map((r) => r[1].toLowerCase()))
    )
      .sort(function (a, b) {
        return b.length - a.length;
      })
      .join(',');

    // Get the highlighted body fragment with the highest score to display it on the search results page.
    // If not available, use the first 300 characters of the body
    const bodyExcerpt = (
      highlightBodyKey
        ? mainResultHighlight[highlightBodyKey][0]
        : mainResultBodyFragment
    )
      .replace(titleText, '')
      .replaceAll(/\s{2,}/gm, '');

    return {
      ...mainResult,
      score: mainResultScore,
      title: sanitizeTagNames(titleText),
      titlePlain: sanitizeTagNames(mainResultTitle),
      body: sanitizeTagNames(bodyExcerpt + '...'),
      bodyPlain: sanitizeTagNames(mainResultBodyFragment + '...'),
      innerHits: otherHits.map((r) => r._source),
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
            query: 'how to run jutro app locally',
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

    const filtersValidatedAgainstDb = await validateFilterValuesAgainstDb(
      req,
      res,
      filters
    );

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
        vectorSearchResults: results.vectorHits,
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
        filters: filtersValidatedAgainstDb,
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
