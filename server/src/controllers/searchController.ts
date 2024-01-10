import { Client } from '@elastic/elasticsearch';
import {
  KnnQuery,
  QueryDslQueryContainer,
  SearchHighlight,
  SearchHit,
} from '@elastic/elasticsearch/lib/api/types';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Version } from '../model/entity/Version';
import {
  SearchData,
  SearchResultSource,
  ServerSearchFilter,
  ServerSearchFilterValue,
  ServerSearchResult,
} from '../types/serverSearch';
import { getAllEntities } from './configController';
import { winstonLogger } from './loggerController';

import { createVectorFromText } from './machineLearningController';

type FilterFromUrl = {
  [x: string]: string[];
};

dotenv.config();
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const searchIndexName = 'gw-docs';
const fragmentSize = 300;

// Every keyword field in Elasticsearch is included in the filter list
async function getKeywordFields(): Promise<string[]> {
  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });
  const mappings = mappingResults[searchIndexName].mappings.properties;
  if (!mappings) {
    return [];
  }

  return Object.keys(mappings).filter(
    (key) => mappings[key].type === 'keyword'
  );
}

// Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
// values that contain commas are wrapped in quotes by the getDocumentMetadataById function in configController.js
// Therefore, filter values must be parsed here taking quotes into account.
function getFiltersFromUrl(
  filterFields: string[],
  queryParams: SearchReqQuery
): FilterFromUrl {
  try {
    let filtersFromUrl: FilterFromUrl = {};
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

async function getAllowedFilterValues(
  fieldName: string,
  query: QueryDslQueryContainer
): Promise<ServerSearchFilterValue[]> {
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

    const result = await elasticClient.search<SearchResultSource>(requestBody);

    // @ts-ignore
    return result.aggregations?.allowedForField.keywordFilter.buckets.map(
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
          query: ${query}, 
          ERROR: ${JSON.stringify(err)}`
    );

    return [];
  }
}

type GuidewireSearchControllerFilter = {
  name: string;
  values: ServerSearchFilterValue[];
};

async function getFilters(
  query: QueryDslQueryContainer,
  filterFields: string[],
  urlFilters: FilterFromUrl
): Promise<GuidewireSearchControllerFilter[]> {
  try {
    let filterNamesAndValues: GuidewireSearchControllerFilter[] = [];
    for (const field of filterFields) {
      const additionalQueryFilters: QueryDslQueryContainer[] = [];
      if (field === 'version') {
        additionalQueryFilters.push({
          term: {
            platform: 'Self-managed',
          },
        });
      }
      if (field === 'release') {
        additionalQueryFilters.push({
          term: {
            platform: 'Cloud',
          },
        });
      }
      if (query.bool?.filter) {
        (query.bool!.filter as QueryDslQueryContainer[]).push(
          ...additionalQueryFilters
        );
      } else {
        query.bool!.filter = additionalQueryFilters;
      }

      const allowedFilterValues = await getAllowedFilterValues(field, query);

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
          QUERY: ${JSON.stringify(query)},    
          FILTER FIELDS: ${filterFields},  
          URL FILTERS: ${JSON.stringify(urlFilters)},
          ERROR: ${err}: ==> ${JSON.stringify(err)}`
    );

    return [];
  }
}

// TODO: This function is a temporary solution. We need to align the data model in Elasticsearch
//  with the database data model to be able to filter out values in a more flexible way.
async function validateFilterValuesAgainstDb(
  req: Request,
  res: Response,
  searchFilters: GuidewireSearchControllerFilter[]
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

function createQueryFilters(
  urlFilters: {
    [x: string]: string[];
  },
  requestIsAuthenticated: Boolean,
  hasGuidewireEmail: Boolean
) {
  let queryFilters = [];
  if (urlFilters) {
    for (const [key, value] of Object.entries(urlFilters)) {
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

function addFiltersToQuery(
  query: QueryDslQueryContainer,
  queryFilters: QueryDslQueryContainer[]
) {
  const updatedQuery = JSON.parse(JSON.stringify(query));
  if (queryFilters.length > 0) {
    updatedQuery.bool.filter = queryFilters;
  }
  return updatedQuery;
}

function addFiltersToKnnQuery(
  knnQuery: KnnQuery[],
  queryFilters: QueryDslQueryContainer[]
) {
  const updatedKnnQuery = [...knnQuery];
  if (queryFilters.length > 0) {
    updatedKnnQuery[0].filter = queryFilters;
    updatedKnnQuery[1].filter = queryFilters;
  }
  return updatedKnnQuery;
}

async function runSearch(
  query: any,
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
      },
      pre_tags: ['<span class="searchResultHighlight highlighted">'],
      post_tags: ['</span>'],
    };

    const resultsCount = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 0,
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
    const numberOfHits = resultsCount.aggregations?.totalHits.doc_count;
    // @ts-ignore
    const numberOfCollapsedHits =
      // @ts-ignore
      resultsCount.aggregations?.totalHits.totalCollapsedHits.value;
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
          ERROR: ${JSON.stringify(err)}`
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
    const searchResultsCount = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 0,
      aggs: {
        totalHits: {
          filter: {
            bool: {
              filter: knnQuery[0].filter,
            },
          },
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
    });

    const results = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      from: startIndex,
      size: resultsPerPage,
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
    const numberOfHits = searchResultsCount.aggregations?.totalHits.doc_count;
    // @ts-ignore
    const numberOfCollapsedHits =
      // @ts-ignore
      searchResultsCount.aggregations?.totalHits.totalCollapsedHits.value;
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
          knnQuery: ${knnQuery},    
          startIndex: ${startIndex},  
          resultsPerPage: ${resultsPerPage},
          ERROR: ${JSON.stringify(err)}`
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
    const searchResultsCount = await elasticClient.search<SearchResultSource>({
      index: searchIndexName,
      size: 0,
      aggs: {
        totalHits: {
          filter: {
            bool: {
              filter: knnQuery[0].filter,
            },
          },
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
    const numberOfHits = searchResultsCount.aggregations?.totalHits.doc_count;
    // @ts-ignore
    const numberOfCollapsedHits =
      // @ts-ignore
      searchResultsCount.aggregations?.totalHits.totalCollapsedHits.value;
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
          ERROR: ${JSON.stringify(err)}`
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
  return results.hits.map((result) => {
    const innerHits = result.inner_hits?.same_title.hits.hits || [];
    const allHits = [result, ...innerHits];
    const allHitsSortedFromLatest = getUniqueResultsSortedByVersion(allHits);
    const [topHit, ...otherHits] = allHitsSortedFromLatest;
    const mainResult = topHit._source;
    const mainResultScore = topHit._score;
    const mainResultTitle = mainResult?.title || 'Unknown title';
    const mainResultBody = mainResult?.body || '';
    const mainResultBodyFragment = mainResultBody
      .substring(0, fragmentSize)
      .replace(mainResultTitle, '')
      .replaceAll(/\s{2,}/gm, '');
    return {
      title: mainResultTitle,
      body: mainResultBodyFragment,
      innerHits: otherHits?.map((ih) => ih._source as SearchResultSource) || [],
      product: mainResult?.product || [],
      doc_display_title:
        mainResult?.doc_display_title ||
        result._source?.doc_display_title ||
        null,
      doc_id: mainResult?.doc_id || '',
      doc_title: mainResult?.doc_title || 'Unknown doc title',
      href: mainResult?.href || '',
      id: mainResult?.id || '',
      indexed_date: mainResult?.indexed_date || '',
      internal: mainResult?.internal || true,
      language: mainResult?.language || 'en',
      platform: mainResult?.platform || [],
      public: mainResult?.public || false,
      release: mainResult?.release || [],
      subject: mainResult?.subject || [],
      version: mainResult?.version || [],
      score: mainResultScore || 0,
    };
  });
}

function prepareResultsToDisplay(
  results: GuidewireSearchControllerSearchResults
): SearchData['searchResults'] {
  return results.hits.map((result) => {
    const innerHits = result.inner_hits?.same_title.hits.hits || [];
    const allHits = [result, ...innerHits];
    const allHitsSortedFromLatest = getUniqueResultsSortedByVersion(allHits);
    const [topHit, ...otherHits] = allHitsSortedFromLatest;
    const mainResult = topHit._source;
    const mainResultScore = topHit._score;
    const mainResultHighlight = topHit.highlight;
    const mainResultTitle = mainResult?.title || 'Unknown title';
    const mainResultBody = mainResult?.body || '';
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
    const titleText =
      highlightTitleKey && mainResultHighlight
        ? mainResultHighlight[highlightTitleKey][0]
        : mainResultTitle;
    // If there are highlights in the body, join all fragments to get a complete list of highlighted terms
    const bodyText =
      highlightBodyKey && mainResultHighlight
        ? mainResultHighlight[highlightBodyKey].join(' ')
        : mainResultBodyFragment;
    const allText: string = titleText + bodyText;
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
      highlightBodyKey && mainResultHighlight
        ? mainResultHighlight[highlightBodyKey][0]
        : mainResultBodyFragment
    )
      .replace(titleText, '')
      .replaceAll(/\s{2,}/gm, '');

    return {
      product: mainResult?.product || [],
      doc_display_title:
        mainResult?.doc_display_title ||
        result._source?.doc_display_title ||
        null,
      doc_id: mainResult?.doc_id || '',
      doc_title: mainResult?.doc_title || 'Unknown doc title',
      href: mainResult?.href || '',
      id: mainResult?.id || '',
      indexed_date: mainResult?.indexed_date || '',
      internal: mainResult?.internal || true,
      language: mainResult?.language || 'en',
      platform: mainResult?.platform || [],
      public: mainResult?.public || false,
      release: mainResult?.release || [],
      subject: mainResult?.subject || [],
      version: mainResult?.version || [],
      score: mainResultScore || 0,
      title: sanitizeTagNames(titleText),
      titlePlain: sanitizeTagNames(mainResultTitle),
      body: sanitizeTagNames(bodyExcerpt + '...'),
      bodyPlain: sanitizeTagNames(mainResultBodyFragment + '...'),
      innerHits: otherHits?.map((r) => r._source as SearchResultSource) || [],
      uniqueHighlightTerms: uniqueHighlightTerms,
    };
  });
}

type SearchReqDictionary = {};
type SearchReqBody = {};
type SearchReqQuery = {
  q?: string;
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

export default async function searchController(
  req: SearchRequestExpress,
  res: Response,
  next: NextFunction
): Promise<SearchControllerResponse | void> {
  try {
    const urlQueryParameters = req.query;
    const searchPhrase = urlQueryParameters.q
      ? decodeURI(urlQueryParameters.q)
      : '';
    const resultsPerPage = parseInt(urlQueryParameters.pagination || '10');
    const currentPage = parseInt(urlQueryParameters.page || '1');
    const startIndex = resultsPerPage * currentPage - 1;
    const userInfo = res.locals.userInfo;
    const requestIsAuthenticated = userInfo.isLoggedIn;
    const hasGuidewireEmail = userInfo.hasGuidewireEmail;
    const keywordFields = await getKeywordFields();
    const filtersFromUrl = getFiltersFromUrl(keywordFields, urlQueryParameters);
    const queryFilters = createQueryFilters(
      filtersFromUrl,
      requestIsAuthenticated,
      hasGuidewireEmail
    );

    const queryBody: QueryDslQueryContainer = {
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

    const queryWithFilters = addFiltersToQuery(queryBody, queryFilters);

    const filters = await getFilters(
      queryWithFilters,
      keywordFields,
      filtersFromUrl
    );

    const filtersValidatedAgainstDb = await validateFilterValuesAgainstDb(
      req,
      res,
      filters
    );

    const keywordResults = await runSearch(
      queryWithFilters,
      startIndex,
      resultsPerPage
    );

    const vectorizedSearchPhrase = await createVectorFromText(searchPhrase);

    let semanticResultsToDisplay: ServerSearchResult[] = [];
    let hybridResultsToDisplay: ServerSearchResult[] = [];
    if (vectorizedSearchPhrase) {
      const knnQueryBody = [
        {
          field: 'title_vector',
          query_vector: vectorizedSearchPhrase,
          num_candidates: 100,
          k: 100,
          boost: 12,
        },
        {
          field: 'body_vector',
          query_vector: vectorizedSearchPhrase,
          num_candidates: 100,
          k: 100,
        },
      ];
      const knnQueryWithFilters = addFiltersToKnnQuery(
        knnQueryBody,
        queryFilters
      );
      const semanticResults = await runSemanticSearch(
        knnQueryWithFilters,
        startIndex,
        resultsPerPage
      );
      const hybridResults = await runHybridSearch(
        queryWithFilters,
        knnQueryWithFilters,
        startIndex,
        resultsPerPage
      );
      semanticResultsToDisplay =
        prepareVectorizedResultsToDisplay(semanticResults);
      hybridResultsToDisplay = prepareVectorizedResultsToDisplay(hybridResults);
    }

    const keywordResultsToDisplay = prepareResultsToDisplay(keywordResults);

    if (req.query.rawJSON === 'true') {
      return {
        status: 200,
        body: keywordResultsToDisplay,
      };
    } else {
      const searchData: SearchData = {
        searchPhrase: searchPhrase,
        searchResults: keywordResultsToDisplay,
        semanticSearchResults: semanticResultsToDisplay,
        hybridSearchResults: hybridResultsToDisplay,
        totalNumOfResults: keywordResults?.numberOfHits || 0,
        totalNumOfCollapsedResults: keywordResults?.numberOfCollapsedHits || 0,
        currentPage: currentPage,
        // We limited the number of pages because the search results page crashes when there are over 10000 hits
        // and you try to display a page for results from 10000 upward
        pages: Math.ceil(
          (keywordResults?.numberOfCollapsedHits <= 10000
            ? keywordResults?.numberOfCollapsedHits
            : 10000) / resultsPerPage
        ),
        resultsPerPage: resultsPerPage,
        filters: filtersValidatedAgainstDb.map((f) => ({
          name: f.name,
          values: f.values,
        })) as ServerSearchFilter[],
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
