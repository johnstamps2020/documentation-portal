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
    label: 'Choisir la langue',
    selectedItemLabel: 'Français',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Nouveautés de Hakuba',
      pagePath: 'l10n/fr-FR/202306hakubawhatsnew',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n/fr-FR/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/fr-FR/cc',
    },
    {
      label: 'Cloud Platform',
      pagePath: 'l10n/fr-FR/cp',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/fr-FR/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/fr-FR/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/fr-FR/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/fr-FR/cm',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n/fr-FR/dh',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n/fr-FR/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/fr-FR/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/fr-FR/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n/fr-FR/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/fr-FR/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/fr-FR/ve',
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
