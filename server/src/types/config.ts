import { DocConfig } from '../model/entity/DocConfig';
import { Environment } from './environment';

export type EnvProps = {
  envName: Environment;
};

export type ServerConfig = {
  docs: DocConfig[];
};
