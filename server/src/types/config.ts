import { Doc, Page, ExternalLink } from '@doctools/components';

export type PageItemsRequestBody = {
  docIds: string[];
  pagePaths: string[];
  externalLinkUrls: string[];
};

export type PageItemsResponse = {
  docs: Doc[];
  pages: Page[];
  externalLinks: ExternalLink[];
};

export type SearchFilters = {
  [key: string]: string[];
};
