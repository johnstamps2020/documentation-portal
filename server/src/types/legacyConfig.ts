import { integer } from '@elastic/elasticsearch/api/types';

export type Environment = string;

export type Environments = Environment[];

export class Metadata {
  product: string[];
  platform: string[];
  version: string[];
  subject: string[];
  release: string[];
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
  resources: Array<string>;
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
  pollInterval: integer;
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
