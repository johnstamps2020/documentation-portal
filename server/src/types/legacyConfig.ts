export class legacyItem {
  label: string;
  class: string;
  id: string | null;
  page: string | null;
  link: string | null;
  env: string[] | null;
  items: legacyItem[] | null;
}

export class legacySelector {
  label: string;
  class: string;
  selectedItem: string;
  items: legacyItem[];
}

export class legacyPageConfig {
  path: string;
  title: string;
  template: string;
  includeInBreadcrumbs: boolean;
  class: string;
  selector: legacySelector;
  search_filters: { [key: string]: string[] };
  items: legacyItem[];
}

export type Environment = string;

export type Environments = Environment[];

export class Metadata {
  product: string[];
  platform: string[];
  version: string[];
  subject: string[] | null;
  release: string[] | null;
}

export class legacyDocConfig {
  id: string;
  title: string;
  url: string;
  body: string;
  metadata: Metadata;
  environments: Environments;
  displayOnLandingPages: boolean;
  indexForSearch: boolean;
  public: boolean;
  internal: boolean;
  earlyAccess: boolean;
}

export class legacyBuildConfig {
  buildType: string;
  filter: string;
  root: string;
  workingDir: string;
  indexRedirect: boolean;
  srcId: string;
  docId: string;
  resources: Array<{
    sourceFolder: string;
    targetFolder: string;
    srcId: string;
  }>;
  nodeImageVersion: string;
  yarnBuildCustomCommand: string;
  outputPath: string;
  zipFilename: string;
  customEnv: { name: string; value: string }[];
}

export class legacySourceConfig {
  id: string;
  title: string;
  sourceType: string;
  gitUrl: string;
  xdocsPathIds: Array<string>;
  branch: string;
  exportFrequency: string;
  pollInterval: number;
}

export type EnvProps = {
  envName: Environment;
};

export type legacyDocsConfigFile = {
  docs: legacyDocConfig[];
};

export type legacyBuildsConfigFile = {
  builds: legacyBuildConfig[];
};

export type legacySourcesConfigFile = {
  sources: legacySourceConfig[];
};
