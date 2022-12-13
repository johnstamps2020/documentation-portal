import { UserInfo } from '../../types/user';

export const internalMockUserData: UserInfo = {
  isLoggedIn: true,
  name: 'Alfred Lord Tennyson',
  preferred_username: 'atennyson@guidewire.com',
  email: 'atennyson@guidewire.com',
  hasGuidewireEmail: true,
  locale: 'en-US',
};

export const externalMockUserData: UserInfo = {
  isLoggedIn: true,
  name: 'Gerard Manley Hopkins',
  preferred_username: 'ghopkins@gcustomer.com',
  email: 'ghopkins@gcustomer.com',
  hasGuidewireEmail: false,
  locale: 'en-US',
};
