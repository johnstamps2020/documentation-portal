import { Environment } from './config';

export type Selector = {
  label: string;
  class: string;
  selectedItem: Item;
  items: Item[];
};

export type LinkProps = {
  label: string;
  id?: string;
  page?: string;
  link?: string;
};

export type Item = LinkProps & {
  class?: string;
  env?: Environment[];
  items?: Item[];
};

export type Page = {
  title: string;
  template: string;
  class: string;
  items: Item[];
  includeInBreadcrumbs?: boolean;
  selector?: Selector;
  search_filters?: {
    platform: string[];
    product: string[];
    version: string[];
  };
};
