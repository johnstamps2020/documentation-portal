import { Strategy, StrategyOptions } from 'openid-client';

export type OktaRegion = 'amer' | 'emea' | 'apac';

export type OktaInstance = {
  region: OktaRegion;
  url: string;
  clientId: string;
  clientSecret: string;
};

export type OktaStrategy = {
  region: OktaRegion;
  oidcStrategy: OidcStrategy;
};

export type OidcStrategy = {
  name: string;
  instance: Strategy<StrategyOptions>;
};
