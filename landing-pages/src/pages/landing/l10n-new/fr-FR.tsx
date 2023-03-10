import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  items: [
    {
      label: 'BillingCenter',
      pagePath: 'l10n-new/fr-FR/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/fr-FR/cc',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/fr-FR/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/fr-FR/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/fr-FR/ce-qb',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n-new/fr-FR/dh',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n-new/fr-FR/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/fr-FR/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/fr-FR/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n-new/fr-FR/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/fr-FR/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/fr-FR/ve',
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

export default function FrFR() {
  return <ProductFamilyLayout {...pageConfig} />;
}
