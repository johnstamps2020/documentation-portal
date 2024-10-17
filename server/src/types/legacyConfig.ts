import { Version } from '../model/entity/Version';

export type LegacyVersionObject = {
  versions: string[] | Version[];
  releases: string[];
  url: string;
  currentlySelected?: boolean;
  label: string;
};

export type LegacyItem = {
  label: string;
  class: string;
  id: string;
  page: string;
  link: string;
  env: string[];
  items: LegacyItem[];
};

export type LegacySelector = {
  label: string;
  class: string;
  selectedItem: string;
  items: LegacyItem[];
};

type SearchFilters = { [key: string]: string[] };

export type LegacyPageConfig = {
  path: string;
  title: string;
  template: string;
  includeInBreadcrumbs: boolean;
  class: string;
  selector: LegacySelector;
  search_filters: SearchFilters;
  items: LegacyItem[];
  internal: boolean;
  public: boolean;
};

type Environment = 'staging' | 'prod';

type EnvironmentVariable = { name: string; value: string };

type Metadata = {
  product: string[];
  platform: string[];
  version: string[];
  language: string;
  subject?: string[];
  release?: string[];
};

export type LegacyDocConfig = {
  id: string;
  title: string;
  displayTitle?: string;
  url: string;
  body?: string;
  metadata: Metadata;
  environments: Environment[];
  displayOnLandingPages: boolean;
  indexForSearch: boolean;
  public: boolean;
  ignorePublicPropertyAndUseVariants?: boolean;
  internal: boolean;
  earlyAccess: boolean;
  updatePreview?: boolean;
};

export type LegacyBuildResource = {
  sourceFolder: string;
  targetFolder: string;
  srcId: string;
};

export type LegacyBuildConfig = {
  buildType: 'dita' | 'source-zip' | 'storybook' | 'yarn' | 'just-copy';
  filter?: string;
  root?: string;
  workingDir?: string;
  indexRedirect?: boolean;
  srcId: string;
  docId: string;
  resources?: LegacyBuildResource[];
  nodeImageVersion?: string;
  yarnBuildCustomCommand?: string;
  outputPath?: string;
  zipFilename?: string;
  customEnv?: EnvironmentVariable[];
  disabled: boolean;
};

export type LegacySourceConfig = {
  id: string;
  title: string;
  gitUrl: string;
  branch: string;
};

export type LegacyDocsConfigFile = {
  docs: LegacyDocConfig[];
};

export type LegacyBuildsConfigFile = {
  builds: LegacyBuildConfig[];
};

export type LegacySourcesConfigFile = {
  sources: LegacySourceConfig[];
};

export type PlatformProductVersionCombination = {
  productName: string;
  platformName: string;
  versionName: string;
};
