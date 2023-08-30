import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: '言語を選択する',
    selectedItemLabel: '日本語',
    items: allSelectors.s04276cabb68afefd84d353cd088adf27,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Garmisch (2023.02) の新機能',
      pagePath: 'l10n/ja-JP/202302garmischwhatsnew',
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
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/ja-JP/cm',
    },
    {
      label: 'Cloud Platform',
      pagePath: 'l10n/ja-JP/cp',
    },
    {
      label: 'Guidewire Testing',
      pagePath: 'l10n/ja-JP/gtest',
    },
    {
      label: 'Guidewire Identity Federation Hub',
      pagePath: 'l10n/ja-JP/gwid',
    },
    {
      label: 'Guidewire for Salesforce',
      pagePath: 'l10n/ja-JP/gwsf',
    },
    {
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n/ja-JP/is-configupgradetools',
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

export default function JaJP() {
  return <ProductFamilyLayout {...pageConfig} />;
}