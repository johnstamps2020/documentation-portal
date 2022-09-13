export enum Environment {
  DEV = 'dev',
  INT = 'int',
  STAGING = 'staging',
  PROD = 'prod',
}

export type EnvProps = {
  envName: Environment;
};
