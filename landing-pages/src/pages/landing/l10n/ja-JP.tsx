import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: '言語を選択する',
    selectedItemLabel: '日本語',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Innsbruck (2023.10) の新機能',
      docId: 'whatsnewjaJPinnsbruck',
    },
    {
      label: 'Hakuba (2023.06) の新機能',
      pagePath: 'l10n/ja-JP/202306hakubawhatsnew',
    },
    {
      label: 'Garmisch (2023.02) の新機能',
      pagePath: 'l10n/ja-JP/202302garmischwhatsnew',
    },
    {
      label: 'Advanced Product Designer',
      pagePath: 'l10n/ja-JP/apd',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n/ja-JP/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/ja-JP/cc',
    },
    {
      label: 'Cloud Platform',
      pagePath: 'l10n/ja-JP/cp',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/ja-JP/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/ja-JP/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/ja-JP/ce-qb',
    },
    {
      label: 'Gosu リファレンスガイド',
      docId: 'gosureflatestjaJP',
    },
    {
      label: 'Guidewire for Salesforce',
      pagePath: 'l10n/ja-JP/gwsf',
    },
    {
      label: 'Guidewire Identity Federation Hub',
      pagePath: 'l10n/ja-JP/gwid',
    },
    {
      label: 'Guidewire Testing',
      pagePath: 'l10n/ja-JP/gtest',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/ja-JP/cm',
    },
    {
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n/ja-JP/is-configupgradetools',
    },
    {
      label: 'Integration Gateway',
      docId: 'integgatewaydevlatestjaJP',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/ja-JP/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/ja-JP/pe',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/ja-JP/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/ja-JP/ve',
    },
],
  sidebar: implementationResourcesSidebar,
};

export default function JaJP() {
  return <ProductFamilyLayout {...pageConfig} />;
}
