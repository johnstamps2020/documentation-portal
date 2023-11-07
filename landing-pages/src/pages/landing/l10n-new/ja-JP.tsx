import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  items: [
    {
      label: 'BillingCenter',
      pagePath: 'l10n-new/ja-JP/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/ja-JP/cc',
    },
    {
      label: 'Platform',
      pagePath: 'l10n-new/ja-JP/gch',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/ja-JP/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/ja-JP/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/ja-JP/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n-new/ja-JP/cm',
    },
    {
      label: 'Guidewire Identity Federation Hub',
      pagePath: 'l10n-new/ja-JP/gwid',
    },
    {
      label: 'Guidewire for Salesforce',
      pagePath: 'l10n-new/ja-JP/gwsf',
    },
    {
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n-new/ja-JP/is-configupgradetools',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/ja-JP/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/ja-JP/pe',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/ja-JP/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/ja-JP/ve',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function JaJP() {
  return <ProductFamilyLayout {...pageConfig} />;
}
