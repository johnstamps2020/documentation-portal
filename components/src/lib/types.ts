export type UserInformation = {
  hasGuidewireEmail: boolean;
  isLoggedIn: boolean;
  preferred_username: string;
  name: string;
  error?: any;
  isAdmin?: boolean;
  isPowerUser?: boolean;
};

export type SearchMeta = {
  docTitle: string;
  docInternal: boolean;
  docEarlyAccess: boolean;
  product: string[];
  platform: string[];
  version: string[];
  release: string[];
  subject: string[];
};
