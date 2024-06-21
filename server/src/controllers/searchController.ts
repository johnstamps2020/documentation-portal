import { Client } from '@elastic/elasticsearch';
import {
  AggregationsAggregationContainer,
  KnnQuery,
  QueryDslQueryContainer,
  SearchHighlight,
  SearchHit,
} from '@elastic/elasticsearch/lib/api/types';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { Version } from '../model/entity/Version';
import {
  SearchData,
  SearchResultSource,
  SearchType,
  ServerSearchFilter,
  ServerSearchFilterValue,
} from '../types/serverSearch';
import { getAllEntities } from './configController';
import { winstonLogger } from './loggerController';

import { createVectorFromText } from './machineLearningController';

type UrlFilters = {
  [x: string]: string[];
};

const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const searchIndexName = 'gw-docs';
const fragmentSize = 300;

// Every keyword field in Elasticsearch is included in the filter list
async function getKeywordFields(): Promise<ServerSearchFilter['name'][]> {
  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });
  const mappings = mappingResults[searchIndexName].mappings.properties;
  if (!mappings) {
    return [];
  }

  return Object.keys(mappings).filter(
    (key) => mappings[key].type === 'keyword'
  ) as ServerSearchFilter['name'][];
}

// Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
// values that contain commas are wrapped in quotes by the getDocumentMetadataById function in configController.js
// Therefore, filter values must be parsed here taking quotes into account.
function getFiltersFromUrl(
  filterFields: string[],
  queryParams: SearchReqQuery
): UrlFilters {
  try {
    let filtersFromUrl: UrlFilters = {};
    for (const param in queryParams) {
      if (filterFields.includes(param)) {
        const matchingParamValue = Object.entries(queryParams).find(
          ([key]) => key === param
        );

        if (!matchingParamValue) {
          continue;
        }

        const paramValues = decodeURI(matchingParamValue[1]);
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

    return {};
  }
}

type GwSearchRequest = {
  index: string;
  size: number;
  query?: QueryDslQueryContainer;
  knn?: KnnQuery[];
  body: {
    aggs: Record<string, AggregationsAggregationContainer>;
  };
};

async function getAllowedFilterValues(
  fieldName: string,
  query?: QueryDslQueryContainer,
  knnQuery?: KnnQuery[]
): Promise<ServerSearchFilterValue[]> {
  try {
    let searchRequest: GwSearchRequest = {
      index: searchIndexName,
      size: 0,
      query: query || {},
      knn: knnQuery || [],
      body: {
        aggs: {
          allowedValues: {
            terms: {
              field: fieldName,
              size: 100,
            },
          },
        },
      },
    };

    if (!query) {
      delete searchRequest.query;
    }

    if (!knnQuery) {
      delete searchRequest.knn;
    }

    const result = await elasticClient.search<SearchResultSource>(
      searchRequest
    );

    // @ts-ignore
    return result.aggregations?.allowedValues.buckets.map(
      (bucket: ServerSearchFilterValue) => {
        // @ts-ignore
        return {
          label: bucket.key || bucket.label,
          doc_count: bucket.doc_count,
        };
      }
    );
  } catch (err) {
    winstonLogger.error(
      `Problem getting allowed filter values for 
          fieldName: ${fieldName}, 
          query: ${JSON.stringify(query)},
          knnQuery: ${JSON.stringify(knnQuery)}, 
          ERROR: ${JSON.stringify(err)}`
    );

    return [];
  }
}

async function createSearchFilters(
  filterFields: ServerSearchFilter['name'][],
  urlFilters: UrlFilters,
  requestIsAuthenticated: Boolean,
  hasGuidewireEmail: Boolean,
  queryBody?: QueryDslQueryContainer,
  knnQueryBody?: KnnQuery[]
): Promise<ServerSearchFilter[]> {
  try {
    let filterNamesAndValues: ServerSearchFilter[] = [];
    for (const field of filterFields) {
      const queryFiltersForFilterValues =
        createElasticsearchQueryFiltersForFilterValues(
          field,
          urlFilters,
          requestIsAuthenticated,
          hasGuidewireEmail
        );
      const updatedQuery = queryBody
        ? addFiltersToElasticsearchQuery(queryBody, queryFiltersForFilterValues)
        : queryBody;
      const updatedKnnQuery = knnQueryBody
        ? addFiltersToElasticsearchKnnQuery(
            knnQueryBody,
            queryFiltersForFilterValues
          )
        : knnQueryBody;

      const allowedFilterValues = await getAllowedFilterValues(
        field,
        updatedQuery,
        updatedKnnQuery
      );

      const urlFilterValues = urlFilters.hasOwnProperty(field)
        ? urlFilters[field]
        : [];

      const allowedFilterValueLabels =
        allowedFilterValues?.map((v) => v.label) || [];
      const allFilterValues = Array.from(
        new Set([...allowedFilterValueLabels, ...urlFilterValues])
      );
      const filterValuesObjects = allFilterValues
        ?.map((value) => {
          const docCount =
            allowedFilterValues?.find((v) => v.label === value)?.doc_count || 0;
          const isFilterChecked = !!urlFilterValues.find((v) => v === value);
          return {
            label: value,
            doc_count: docCount,
            checked: isFilterChecked,
          };
        })
        .filter(Boolean);
      filterNamesAndValues.push({
        name: field,
        values: filterValuesObjects,
      });
    }

    return filterNamesAndValues;
  } catch (err) {
    winstonLogger.error(
      `Problem getting filters for 
          QUERY: ${JSON.stringify(queryBody)},
          KNN QUERY: ${JSON.stringify(knnQueryBody)},    
          FILTER FIELDS: ${filterFields},  
          URL FILTERS: ${JSON.stringify(urlFilters)},
          ERROR: ${err}: ==> ${JSON.stringify(err)}`
    );

    return [];
  }
}

// TODO: This function is a temporary solution. We need to align the data model in Elasticsearch
//  with the database data model to be able to filter out values in a more flexible way.
async function validateSearchFiltersAgainstDb(
  req: Request,
  res: Response,
  searchFilters: ServerSearchFilter[]
) {
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
      const response = await getAllEntities(
        reqWithParams as unknown as Request,
        res
      );
      if (response.status === 200) {
        const filterValuesFromDb = response.body.map((v: Version) =>
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

type GuidewireSearchControllerSearchResults = {
  numberOfHits: number;
  numberOfCollapsedHits: number;
  hits: SearchHit<SearchResultSource>[];
};

const noHitsResponse: GuidewireSearchControllerSearchResults = {
  numberOfHits: 0,
  numberOfCollapsedHits: 0,
  hits: [],
};

// To get all allowed values for a keyword field, we must run a query with all checked filters,
// except for filters for this keyword field.
function createElasticsearchQueryFiltersForFilterValues(
  filterName: ServerSearchFilter['name'],
  urlFilters: UrlFilters,
  requestIsAuthenticated: Boolean,
  hasGuidewireEmail: Boolean
) {
  let queryFilters = [];
  if (urlFilters) {
    for (const [key, value] of Object.entries(urlFilters)) {
      if (key !== filterName) {
        queryFilters.push({
          terms: {
            [key]: value,
          },
        });
      }
    }
  }

  if (filterName === 'version') {
    queryFilters.push({
      term: {
        platform: 'Self-managed',
      },
    });
  }
  if (filterName === 'release') {
    queryFilters.push({
      term: {
        platform: 'Cloud',
      },
    });
  }

  if (!requestIsAuthenticated) {
    queryFilters.push({
      term: {
        public: true,
      },
    });
  } else if (requestIsAuthenticated && !hasGuidewireEmail) {
    queryFilters.push({
      term: {
        internal: false,
      },
    });
  }
  return queryFilters;
}

function createElasticsearchQueryFiltersForSearchRequest(
  urlFilters: UrlFilters,
  requestIsAuthenticated: Boolean,
  hasGuidewireEmail: Boolean
) {
  let queryFilters = [];
  if (urlFilters) {
    for (const [key, value] of Object.entries(urlFilters)) {
      if (key === 'version') {
        queryFilters.push({
          term: {
            platform: 'Self-managed',
          },
        });
      }
      if (key === 'release') {
        queryFilters.push({
          term: {
            platform: 'Cloud',
          },
        });
      }
      queryFilters.push({
        terms: {
          [key]: value,
        },
      });
    }
  }

  if (!requestIsAuthenticated) {
    queryFilters.push({
      term: {
        public: true,
      },
    });
  } else if (requestIsAuthenticated && !hasGuidewireEmail) {
    queryFilters.push({
      term: {
        internal: false,
      },
    });
  }
  return queryFilters;
}

function addFiltersToElasticsearchQuery(
  query: QueryDslQueryContainer,
  queryFilters: QueryDslQueryContainer[]
) {
  const updatedQuery = JSON.parse(JSON.stringify(query));
  if (queryFilters.length > 0) {
    updatedQuery.bool.filter = queryFilters;
  }
  return updatedQuery;
}

function addFiltersToElasticsearchKnnQuery(
  knnQuery: KnnQuery[],
  queryFilters: QueryDslQueryContainer[]
) {
  const updatedKnnQuery = JSON.parse(JSON.stringify(knnQuery)) as KnnQuery[];
  if (queryFilters.length > 0) {
    updatedKnnQuery.map((queryItem) => {
      queryItem.filter = queryFilters;
    });
  }
  return updatedKnnQuery;
}

async function runKeywordSearch(
  query: QueryDslQueryContainer,
  startIndex: number,
  resultsPerPage: number
): Promise<GuidewireSearchControllerSearchResults> {
  try {
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
    const highlightParameters: SearchHighlight = {
      type: 'fvh',
      fields: {
        title: {
          number_of_fragments: 0,
          matched_fields: ['title', 'title.exact'],
        },

        body: {
          number_of_fragments: 5,
          order: 'score',
          fragment_size: fragmentSize,
          matched_fields: ['body', 'body.exact'],
        },

        keywords: {
          number_of_fragments: 0,
          matched_fields: ['keywords', 'keywords.exact'],
        },
      },
      pre_tags: ['<span class="searchResultHighlight highlighted">'],
      post_tags: ['</span>'],
    };

    const resultCount = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 0,
      query: query,
      aggs: {
        totalHits: {
          value_count: {
            field: 'title.raw',
          },
        },
        // Approximate count of values with the distinct title.
        // We collapse hits for multiple versions under the same title, therefore we need this distinct count
        // to calculate the number of pages.
        totalCollapsedHits: {
          cardinality: {
            field: 'title.raw',
            precision_threshold: 40000,
          },
        },
      },
    });

    const results = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      from: startIndex,
      size: resultsPerPage,
      query: query,
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
    });

    // @ts-ignore
    const numberOfHits = resultCount.aggregations?.totalHits.value;
    // @ts-ignore
    const numberOfCollapsedHits =
      // @ts-ignore
      resultCount.aggregations?.totalCollapsedHits.value;
    const hits = results.hits.hits;

    return {
      numberOfHits,
      numberOfCollapsedHits,
      hits,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem running search for  
          query: ${query},    
          startIndex: ${startIndex},  
          resultsPerPage: ${resultsPerPage},
          ERROR: ${err}`
    );
    return noHitsResponse;
  }
}

async function runSemanticSearch(
  knnQuery: KnnQuery[],
  startIndex: number,
  resultsPerPage: number
): Promise<GuidewireSearchControllerSearchResults> {
  try {
    const resultCount = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 0,
      knn: knnQuery,
      aggs: {
        totalHits: {
          value_count: {
            field: 'title.raw',
          },
        },
      },
    });

    const results = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      from: startIndex,
      size: resultsPerPage,
      knn: knnQuery,
    });

    // @ts-ignore
    const numberOfHits = resultCount.aggregations?.totalHits.value;
    // @ts-ignore
    const hits = results
      ? (results.hits.hits as SearchHit<SearchResultSource>[])
      : [];

    return {
      numberOfHits,
      numberOfCollapsedHits: numberOfHits,
      hits,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem running search for  
          knnQuery: ${knnQuery},    
          startIndex: ${startIndex},  
          resultsPerPage: ${resultsPerPage},
          ERROR: ${err}`
    );
    return noHitsResponse;
  }
}

async function runHybridSearch(
  query: QueryDslQueryContainer,
  knnQuery: KnnQuery[],
  startIndex: number,
  resultsPerPage: number
): Promise<GuidewireSearchControllerSearchResults> {
  try {
    const resultCount = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 0,
      query: query,
      knn: knnQuery,
      aggs: {
        totalHits: {
          value_count: {
            field: 'title.raw',
          },
        },
        // Approximate count of values with the distinct title.
        // We collapse hits for multiple versions under the same title, therefore we need this distinct count
        // to calculate the number of pages.
        totalCollapsedHits: {
          cardinality: {
            field: 'title.raw',
            precision_threshold: 40000,
          },
        },
      },
    });

    const results = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      from: startIndex,
      size: resultsPerPage,
      query: query,
      knn: knnQuery,
      collapse: {
        field: 'title.raw',
        inner_hits: {
          name: 'same_title',
          size: 100,
        },
        max_concurrent_group_searches: 4,
      },
    });

    // @ts-ignore
    const numberOfHits = resultCount.aggregations?.totalHits.value;
    // @ts-ignore
    const numberOfCollapsedHits =
      // @ts-ignore
      resultCount.aggregations?.totalCollapsedHits.value;
    const hits = results
      ? (results.hits.hits as SearchHit<SearchResultSource>[])
      : [];

    return {
      numberOfHits,
      numberOfCollapsedHits,
      hits,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem running search for  
          query: ${query},
          knnQuery: ${knnQuery},    
          startIndex: ${startIndex},  
          resultsPerPage: ${resultsPerPage},
          ERROR: ${err}`
    );
    return noHitsResponse;
  }
}

function sanitizeTagNames(textToSanitize: string) {
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

function getHighestScore(scores: number[]) {
  return Math.max(...scores);
}

function getHighestVersion(
  versions: string[] | undefined | null,
  numeric = false
) {
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

function getUniqueResultsSortedByVersion(
  resultList: SearchHit<SearchResultSource>[]
): SearchHit<SearchResultSource>[] {
  const uniqueResults: SearchHit<SearchResultSource>[] = [];
  for (const result of resultList) {
    if (!uniqueResults.find((r) => r._source?.href === result._source?.href)) {
      uniqueResults.push(result);
    }
  }
  uniqueResults
    .sort(function (a, b) {
      const highestScore = getHighestScore([a._score || 0, b._score || 0]);
      const releaseA = getHighestVersion(a._source?.release);
      const releaseB = getHighestVersion(b._source?.release);
      if (releaseA && releaseB) {
        if (releaseA === releaseB) {
          return highestScore;
        }
        return releaseA.localeCompare(releaseB);
      }
      const verNumA = getHighestVersion(a._source?.version, true);
      const verNumB = getHighestVersion(b._source?.version, true);
      if (!verNumA || !verNumB || verNumA === verNumB) {
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

function prepareVectorizedResultsToDisplay(
  results: GuidewireSearchControllerSearchResults
): SearchData['searchResults'] {
  const vectorizedSearchResultsToDisplay: SearchData['searchResults'] = [];
  for (const result of results.hits) {
    const innerHits = result.inner_hits?.same_title.hits.hits || [];
    const allHits = [result, ...innerHits];
    const allHitsSortedFromLatest = getUniqueResultsSortedByVersion(allHits);
    const [topHit, ...otherHits] = allHitsSortedFromLatest;
    const mainResult = topHit._source;

    if (!mainResult) {
      continue;
    }

    const mainResultScore = topHit._score || 0;
    const mainResultTitle = mainResult.title;
    const mainResultBody = mainResult.body;
    const mainResultBodyFragment = mainResultBody
      .substring(0, fragmentSize)
      .replace(mainResultTitle, '')
      .replaceAll(/\s{2,}/gm, '');
    const preparedInnerHits =
      otherHits?.map((ih) => {
        // TODO: It may be better to exclude these fields from _source in the Elasticsearch mappings.
        //  Refer to: https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html#include-exclude
        delete ih._source?.title_vector;
        delete ih._source?.body_vector;
        return ih._source as SearchResultSource;
      }) || [];
    vectorizedSearchResultsToDisplay.push({
      title: mainResultTitle,
      body: mainResultBodyFragment,
      keywords: mainResult?.keywords || '',
      innerHits: preparedInnerHits,
      product: mainResult.product,
      doc_display_title:
        mainResult.doc_display_title ||
        result._source?.doc_display_title ||
        null,
      doc_id: mainResult.doc_id,
      doc_title: mainResult.doc_title,
      href: mainResult.href,
      id: mainResult.id,
      indexed_date: mainResult.indexed_date,
      internal: mainResult.internal,
      language: mainResult.language,
      platform: mainResult.platform,
      public: mainResult.public,
      release: mainResult.release || [],
      subject: mainResult.subject || [],
      version: mainResult.version,
      score: mainResultScore,
    });
  }
  return vectorizedSearchResultsToDisplay;
}

function prepareResultsToDisplay(
  isAuthenticated: boolean,
  results: GuidewireSearchControllerSearchResults
): SearchData['searchResults'] {
  const searchResultsToDisplay: SearchData['searchResults'] = [];
  for (const result of results.hits) {
    const innerHits = result.inner_hits?.same_title.hits.hits || [];
    const unfilteredAllHits = [result, ...innerHits];
    let allHits = structuredClone(unfilteredAllHits);
    if (isAuthenticated) {
      allHits = unfilteredAllHits.filter(
        (hit) =>
          unfilteredAllHits.find(
            (h) =>
              hit._source.href === h._source.href &&
              hit._source.public !== h._source.public &&
              hit._source.public === false
          ) || true
      );
    }
    const allHitsSortedFromLatest = getUniqueResultsSortedByVersion(allHits);
    const [topHit, ...otherHits] = allHitsSortedFromLatest;
    const mainResult = topHit._source;
    if (!mainResult) {
      continue;
    }

    const mainResultScore = topHit._score || 0;
    const mainResultHighlight = topHit.highlight;
    const mainResultTitle = mainResult.title;
    const mainResultBody = mainResult.body;
    const mainResultBodyFragment = mainResultBody.substring(0, fragmentSize);
    const mainResultKeywords = mainResult.keywords || '';
    let titleText = mainResultTitle;
    let bodyText = mainResultBody;
    let keywordsText = mainResultKeywords;
    // Get the highlighted body fragment with the highest score to display it on the search results page.
    // Use the first 300 characters of the body
    let bodyExcerpt = mainResultBodyFragment;
    if (mainResultHighlight) {
      // The title field in the highlighter matches results from the title and title.exact fields.
      const highlightTitleKey = Object.getOwnPropertyNames(
        mainResultHighlight
      ).find((k) => k === 'title');

      // The body field in the highlighter matches results from the body and body.exact fields.
      const highlightBodyKey = Object.getOwnPropertyNames(
        mainResultHighlight
      ).find((k) => k === 'body');

      const highlightKeywordsKey = Object.getOwnPropertyNames(
        mainResultHighlight
      ).find((k) => k === 'keywords');

      // The "number_of_fragments" parameter is set to "0' for the title and keywords fields.
      // So no fragments are produced, instead the whole content of the field is returned
      // as the first element of the array, and matches are highlighted.
      if (highlightTitleKey) {
        titleText = mainResultHighlight[highlightTitleKey][0];
      }
      // If there are highlights in the body, join all fragments to get a complete list of highlighted terms
      if (highlightBodyKey) {
        bodyText = mainResultHighlight[highlightBodyKey].join(' ');
        bodyExcerpt = mainResultHighlight[highlightBodyKey][0];
      }

      if (highlightKeywordsKey) {
        keywordsText = mainResultHighlight[highlightKeywordsKey][0];
      }
    }

    const allText: string = titleText + bodyText + keywordsText;
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

    searchResultsToDisplay.push({
      product: mainResult.product || [],
      doc_display_title:
        mainResult.doc_display_title ||
        result._source?.doc_display_title ||
        null,
      doc_id: mainResult.doc_id,
      doc_title: mainResult.doc_title,
      href: mainResult.href,
      id: mainResult.id,
      indexed_date: mainResult.indexed_date,
      internal: mainResult.internal,
      language: mainResult.language,
      platform: mainResult.platform,
      public: mainResult.public,
      release: mainResult.release || [],
      subject: mainResult.subject || [],
      version: mainResult.version,
      score: mainResultScore,
      title: sanitizeTagNames(titleText),
      titlePlain: sanitizeTagNames(mainResultTitle),
      body: sanitizeTagNames(
        bodyExcerpt.replace(titleText, '').replaceAll(/\s{2,}/gm, '') + '...'
      ),
      bodyPlain: sanitizeTagNames(mainResultBodyFragment + '...'),
      keywords: sanitizeTagNames(keywordsText),
      innerHits: otherHits?.map((r) => r._source as SearchResultSource) || [],
      uniqueHighlightTerms: uniqueHighlightTerms,
    });
  }

  return searchResultsToDisplay;
}

type SearchReqDictionary = {};
type SearchReqBody = {};
type SearchReqQuery = {
  q?: string;
  searchType?: SearchType;
  pagination?: string;
  resultsPerPage?: string;
  page?: string;
  rawJSON?: string;
  release?: string;
  product?: string;
  version?: string;
  platform?: string;
  subject?: string;
  language?: string;
};
type SearchResBody = {};

type SearchRequestExpress = Request<
  SearchReqDictionary,
  SearchResBody,
  SearchReqBody,
  SearchReqQuery
>;

type SearchControllerResponse = {
  status: number;
  body: SearchData['searchResults'] | SearchData;
};

const searchTypeQueryParameterName = 'searchType';

const errorResponse: SearchControllerResponse = {
  status: 500,
  body: {
    searchPhrase: '',
    currentPage: 1,
    resultsPerPage: 10,
    filtersFromUrl: [],
    requestIsAuthenticated: false,
    searchResults: [],
    totalNumOfResults: 0,
    totalNumOfCollapsedResults: 0,
    pages: 0,
    filters: [],
  },
};

export default async function searchController(
  req: SearchRequestExpress,
  res: Response
): Promise<SearchControllerResponse> {
  try {
    const urlQueryParameters = req.query;
    const searchType =
      urlQueryParameters[searchTypeQueryParameterName] || 'keyword';
    const rawJson = urlQueryParameters.rawJSON === 'true';
    const searchPhrase = urlQueryParameters.q
      ? decodeURI(urlQueryParameters.q)
      : '';
    const resultsPerPage = parseInt(urlQueryParameters.pagination || '10');
    const currentPage = parseInt(urlQueryParameters.page || '1');
    const startIndex = resultsPerPage * (currentPage - 1);
    const userInfo = res.locals.userInfo;
    const requestIsAuthenticated = userInfo.isLoggedIn;
    const hasGuidewireEmail = userInfo.hasGuidewireEmail;
    const keywordFields = await getKeywordFields();
    const filtersFromUrl = getFiltersFromUrl(keywordFields, urlQueryParameters);
    const elasticsearchQueryFilters =
      createElasticsearchQueryFiltersForSearchRequest(
        filtersFromUrl,
        requestIsAuthenticated,
        hasGuidewireEmail
      );
    const elasticsearchQueryBody: QueryDslQueryContainer = {
      bool: {
        must: {
          simple_query_string: {
            query: searchPhrase,
            fields: ['title^12', 'body', 'keywords^20'], //MCG adding keywords here causes error
            quote_field_suffix: '.exact',
            default_operator: 'AND',
          },
        },
      },
    };

    const elasticsearchQueryWithFilters = addFiltersToElasticsearchQuery(
      elasticsearchQueryBody,
      elasticsearchQueryFilters
    );

    if (searchType === 'keyword') {
      const keywordSearchFilters = await createSearchFilters(
        keywordFields,
        filtersFromUrl,
        requestIsAuthenticated,
        hasGuidewireEmail,
        elasticsearchQueryBody,
        undefined
      );

      const keywordSearchFiltersValidatedAgainstDb =
        await validateSearchFiltersAgainstDb(req, res, keywordSearchFilters);

      const keywordSearchResults = await runKeywordSearch(
        elasticsearchQueryWithFilters,
        startIndex,
        resultsPerPage
      );

      const keywordSearchResultsToDisplay = prepareResultsToDisplay(
        requestIsAuthenticated,
        keywordSearchResults
      );

      return rawJson
        ? {
            status: 200,
            body: keywordSearchResultsToDisplay,
          }
        : {
            status: 200,
            body: {
              searchPhrase: searchPhrase,
              currentPage: currentPage,
              resultsPerPage: resultsPerPage,
              filtersFromUrl: filtersFromUrl,
              requestIsAuthenticated: requestIsAuthenticated,
              searchResults: keywordSearchResultsToDisplay,
              totalNumOfResults: keywordSearchResults?.numberOfHits || 0,
              totalNumOfCollapsedResults:
                keywordSearchResults?.numberOfCollapsedHits || 0,
              // We limited the number of pages because the search results page crashes when there are over 10000 hits
              // and you try to display a page for results from 10000 upward
              pages: Math.ceil(
                (keywordSearchResults?.numberOfCollapsedHits <= 10000
                  ? keywordSearchResults?.numberOfCollapsedHits
                  : 10000) / resultsPerPage
              ),
              filters: keywordSearchFiltersValidatedAgainstDb,
            },
          };
    }

    const vectorizedSearchPhrase = await createVectorFromText(searchPhrase);
    if (!vectorizedSearchPhrase) {
      return {
        status: 500,
        body: [],
      };
    }
    const numberOfCandidates = 50;
    const k = 10;
    const elasticsearchKnnQueryBody = [
      {
        field: 'title_vector',
        query_vector: vectorizedSearchPhrase,
        num_candidates: numberOfCandidates,
        k: k,
      },
      {
        field: 'body_vector',
        query_vector: vectorizedSearchPhrase,
        num_candidates: numberOfCandidates,
        k: k,
        boost: 12,
      },
    ];
    const elasticsearchKnnQueryWithFilters = addFiltersToElasticsearchKnnQuery(
      elasticsearchKnnQueryBody,
      elasticsearchQueryFilters
    );

    if (searchType === 'semantic') {
      const semanticSearchFilters = await createSearchFilters(
        keywordFields,
        filtersFromUrl,
        requestIsAuthenticated,
        hasGuidewireEmail,
        undefined,
        elasticsearchKnnQueryBody
      );

      const semanticSearchFiltersValidatedAgainstDb =
        await validateSearchFiltersAgainstDb(req, res, semanticSearchFilters);
      const semanticSearchResults = await runSemanticSearch(
        elasticsearchKnnQueryWithFilters,
        startIndex,
        resultsPerPage
      );
      const semanticSearchResultsToDisplay = prepareVectorizedResultsToDisplay(
        semanticSearchResults
      );
      return rawJson
        ? {
            status: 200,
            body: semanticSearchResultsToDisplay,
          }
        : {
            status: 200,
            body: {
              searchPhrase: searchPhrase,
              currentPage: currentPage,
              resultsPerPage: resultsPerPage,
              filtersFromUrl: filtersFromUrl,
              requestIsAuthenticated: requestIsAuthenticated,
              searchResults: semanticSearchResultsToDisplay,
              totalNumOfResults: semanticSearchResults?.numberOfHits || 0,
              totalNumOfCollapsedResults:
                semanticSearchResults?.numberOfCollapsedHits || 0,
              // We limited the number of pages because the search results page crashes when there are over 10000 hits
              // and you try to display a page for results from 10000 upward
              pages: Math.ceil(
                (semanticSearchResults?.numberOfCollapsedHits <= 10000
                  ? semanticSearchResults?.numberOfCollapsedHits
                  : 10000) / resultsPerPage
              ),
              filters: semanticSearchFiltersValidatedAgainstDb,
            },
          };
    }

    if (searchType === 'hybrid') {
      const hybridSearchFilters = await createSearchFilters(
        keywordFields,
        filtersFromUrl,
        requestIsAuthenticated,
        hasGuidewireEmail,
        elasticsearchQueryBody,
        elasticsearchKnnQueryBody
      );

      const hybridSearchFiltersValidatedAgainstDb =
        await validateSearchFiltersAgainstDb(req, res, hybridSearchFilters);

      const hybridSearchResults = await runHybridSearch(
        elasticsearchQueryWithFilters,
        elasticsearchKnnQueryWithFilters,
        startIndex,
        resultsPerPage
      );
      const hybridSearchResultsToDisplay =
        prepareVectorizedResultsToDisplay(hybridSearchResults);

      return rawJson
        ? {
            status: 200,
            body: hybridSearchResultsToDisplay,
          }
        : {
            status: 200,
            body: {
              searchPhrase: searchPhrase,
              currentPage: currentPage,
              resultsPerPage: resultsPerPage,
              filtersFromUrl: filtersFromUrl,
              requestIsAuthenticated: requestIsAuthenticated,
              searchResults: hybridSearchResultsToDisplay,
              totalNumOfResults: hybridSearchResults?.numberOfHits || 0,
              totalNumOfCollapsedResults:
                hybridSearchResults?.numberOfCollapsedHits || 0,
              // We limited the number of pages because the search results page crashes when there are over 10000 hits
              // and you try to display a page for results from 10000 upward
              pages: Math.ceil(
                (hybridSearchResults?.numberOfCollapsedHits <= 10000
                  ? hybridSearchResults?.numberOfCollapsedHits
                  : 10000) / resultsPerPage
              ),
              filters: hybridSearchFiltersValidatedAgainstDb,
            },
          };
    }

    return errorResponse;
  } catch (err) {
    winstonLogger.error(
      `Problem performing search
          QUERY: ${JSON.stringify(req.query)}
          ERROR: ${JSON.stringify(err)}`
    );
    return errorResponse;
  }
}

// Delta doc functionality

export async function getAllTopicsFromDoc(docId: string) {
  try {
    const result = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: { doc_id: { value: docId } },
              },
            ],
          },
        },
      },
    });

    return result;
  } catch (err) {
    winstonLogger.error(
      `Problem comparing documents
      ERROR: ${JSON.stringify(err)}`
    );
  }
}
