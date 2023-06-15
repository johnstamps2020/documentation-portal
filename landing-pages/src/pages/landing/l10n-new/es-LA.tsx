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
      label: 'BillingCenter',
      pagePath: 'l10n-new/es-LA/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/es-LA/cc',
    },
    {
      label: 'Cloud Data Access',
      pagePath: 'l10n-new/es-LA/cda',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/es-LA/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/es-LA/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/es-LA/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n-new/es-LA/cm',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n-new/es-LA/dh',
    },
    {
      label: 'Explore',
      pagePath: 'l10n-new/es-LA/explore',
    },
    {
      label: 'Guidewire Cloud Console',
      pagePath: 'l10n-new/es-LA/gcc',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n-new/es-LA/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/es-LA/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/es-LA/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n-new/es-LA/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/es-LA/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/es-LA/ve',
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
  releaseSelector: false,
};

export default function EsLA() {
  return <ProductFamilyLayout {...pageConfig} />;
}
