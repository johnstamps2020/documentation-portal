export type SearchData = {
  searchPhrase: string;
  searchResults: ServerSearchResult[];
  totalNumOfResults: number;
  totalNumOfCollapsedResults: number;
  currentPage: number;
  pages: number;
  resultsPerPage: number;
  filters: ServerSearchFilter[];
  filtersFromUrl: {};
  requestIsAuthenticated: boolean;
};

export type ServerSearchResult = {
  href: string;
  score: number;
  title: string;
  titlePlain: string;
  version: string;
  body: string;
  bodyPlain: string;
  docTags: [][] | string[];
  innerHits: [];
  uniqueHighlightTerms: [];
};

export type ServerSearchInnerHit = {
  label: string;
  href: string;
  tags: string[];
};

export type ServerSearchFilterValue = {
  label: string;
  doc_count: number;
  checked: boolean;
};

export type ServerSearchFilter = {
  name: string;
  label?: string;
  values: ServerSearchFilterValue[];
};

export type NestedServerSearchFilter = {
  label: string;
  searchFilters: ServerSearchFilter[];
};

export type ServerSearchError = {
  status: number;
  message: string;
};
