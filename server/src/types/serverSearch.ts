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
  body: string;
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
  titlePlain: string;
  body: string;
  bodyPlain: string;
  innerHits: SearchResultSource[];
  uniqueHighlightTerms: string;
};

export type ServerSearchFilterValue = {
  label: string;
  doc_count: number;
  checked: boolean;
};

export type ServerSearchFilter = {
  name: string;
  values: ServerSearchFilterValue[];
};

export type ServerSearchError = {
  status: number;
  message: string;
};
