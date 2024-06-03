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

export type SearchResultSource = {
  product: string[];
  internal: boolean;
  release: string[] | null;
  subject: string[] | null;
  doc_title: string;
  doc_display_title: string | null;
  language: string;
  title: string;
  title_vector?: number[];
  body: string;
  body_vector?: number[];
  keywords: string;
  doc_id: string;
  version: string[];
  platform: string[];
  public: boolean;
  href: string;
  id: string;
  indexed_date: string;
};

export type ServerSearchResult = SearchResultSource & {
  score: number;
  title: string;
  titlePlain?: string;
  body: string;
  bodyPlain?: string;
  keywords: string;
  innerHits: SearchResultSource[];
  uniqueHighlightTerms?: string;
};

export type ServerSearchFilterValue = {
  label: string;
  key?: string;
  doc_count: number;
  checked: boolean;
};

export type ServerSearchFilter = {
  name:
    | 'platform'
    | 'product'
    | 'version'
    | 'language'
    | 'release'
    | 'subject'
    | 'doc_title'
    | 'doc_display_title';
  values: ServerSearchFilterValue[];
};

export type ServerSearchError = {
  status: number;
  message: string;
};

export type SearchType = 'keyword' | 'semantic' | 'hybrid';

export type SearchFilters = {
  [key: string]: string[];
};
