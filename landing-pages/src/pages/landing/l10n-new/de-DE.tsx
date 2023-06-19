import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  items: [
    {
      label: 'Advanced Product Designer',
      pagePath: 'l10n-new/de-DE/apd',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n-new/de-DE/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/de-DE/cc',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/de-DE/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/de-DE/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/de-DE/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n-new/de-DE/cm',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n-new/de-DE/dh',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n-new/de-DE/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/de-DE/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/de-DE/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n-new/de-DE/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/de-DE/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/de-DE/ve',
    },
  ],
  sidebar: {
    label: 'Implementation Resources',
    items: [
      {
        label: 'Community Case Templates',
        docId: 'cloudtickettemplates',
      },
      {
        label: 'Product Adoption',
        docId: 'surepathmethodologymain',
      },
      {
        label: 'Cloud Standards',
        docId: 'standardslatest',
      },
      {
        label: 'Upgrade Diff Reports',
        pagePath: 'upgradediffs',
      },
      {
        label: 'Internal docs',
        docId: 'internaldocslatest',
      },
    ],
  },
};

export default function DeDE() {
  return <ProductFamilyLayout {...pageConfig} />;
}
