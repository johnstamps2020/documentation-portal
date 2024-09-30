import { UserInfo } from '@doctools/core';

export const internalMockUserData: UserInfo = {
  isLoggedIn: true,
  name: 'Alfred Lord Tennyson',
  preferred_username: 'atennyson@guidewire.com',
  id: 'YXRlbm55c29uQGd1aWRl',
  email: 'atennyson@guidewire.com',
  hasGuidewireEmail: true,
  locale: 'en-US',
  isAdmin: false,
  isPowerUser: false,
};

export const externalMockUserData: UserInfo = {
  isLoggedIn: true,
  name: 'Gerard Manley Hopkins',
  preferred_username: 'ghopkins@gcustomer.com',
  id: 'Z2hvcGtpbnNAZ2N1c3Rv',
  email: 'ghopkins@gcustomer.com',
  hasGuidewireEmail: false,
  locale: 'en-US',
  isAdmin: false,
  isPowerUser: false,
};
