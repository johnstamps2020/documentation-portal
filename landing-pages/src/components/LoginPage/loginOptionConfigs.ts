import { ButtonProps } from '@mui/material/Button';
import { OktaRegion } from 'server/dist/types/auth';

export type LoginButtonConfig = {
  label?: string;
  href: string;
  region?: OktaRegion;
  sx?: ButtonProps['sx'];
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
};

export type LoginOptionConfig = {
  label: string;
  description: string;
  buttons: LoginButtonConfig[];
};

const gwCloudLoginUrl: string = '/authorization-code';
const gwCloudLoginDescription =
  'Use your Guidewire Cloud Platform account to access documentation';

const gwCustomerCommunityLoginOption: LoginOptionConfig = {
  label: 'Customer Community',
  description:
    'Use your community.guidewire.com account to access documentation',
  buttons: [{ href: '/customers-login' }],
};

const gwPartnerCommunityLoginOption: LoginOptionConfig = {
  label: 'Partner Community',
  description: 'Use your partner.guidewire.com account to access documentation',
  buttons: [{ href: '/partners-login' }],
};

const gwCloudLoginButtonAmer: LoginButtonConfig = {
  href: gwCloudLoginUrl,
  region: 'amer',
};
const gwCloudLoginOption: LoginOptionConfig = {
  label: 'Guidewire Cloud',
  description: gwCloudLoginDescription,
  buttons: [
    { ...gwCloudLoginButtonAmer, label: 'AMER' },
    { label: 'APAC', href: gwCloudLoginUrl, region: 'apac' },
    { label: 'EMEA', href: gwCloudLoginUrl, region: 'emea' },
  ],
};

export const loginOptionsProd: LoginOptionConfig[] = [
  gwCloudLoginOption,
  gwCustomerCommunityLoginOption,
  gwPartnerCommunityLoginOption,
];

export const loginOptions: LoginOptionConfig[] = [
  {
    ...gwCloudLoginOption,
    buttons: [gwCloudLoginButtonAmer],
  },
  gwCustomerCommunityLoginOption,
  gwPartnerCommunityLoginOption,
];
