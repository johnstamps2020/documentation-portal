import { Doc } from '../model/entity/Doc';
import { Page } from '../model/entity/Page';
import { ExternalLink } from '../model/entity/ExternalLink';

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
