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
      pagePath: 'l10n-new/pt-BR/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/pt-BR/cc',
    },
    {
      label: 'Cloud Data Access',
      pagePath: 'l10n-new/pt-BR/cda',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/pt-BR/ce-am',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/pt-BR/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n-new/pt-BR/cm',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n-new/pt-BR/dh',
    },
    {
      label: 'Explore',
      pagePath: 'l10n-new/pt-BR/explore',
    },
    {
      label: 'Guidewire Cloud Console',
      pagePath: 'l10n-new/pt-BR/gcc',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n-new/pt-BR/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/pt-BR/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/pt-BR/pe',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/pt-BR/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/pt-BR/ve',
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

export default function PtBR() {
  return <ProductFamilyLayout {...pageConfig} />;
}
