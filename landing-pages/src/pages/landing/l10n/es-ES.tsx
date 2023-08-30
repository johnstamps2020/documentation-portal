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
    label: 'Seleccione el idioma',
    selectedItemLabel: 'Español (España)',
    items: allSelectors.s04276cabb68afefd84d353cd088adf27,
    labelColor: 'white',
  },

  items: [
    {
      label: 'BillingCenter',
      pagePath: 'l10n/es-ES/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/es-ES/cc',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/es-ES/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/es-ES/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/es-ES/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/es-ES/cm',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/es-ES/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/es-ES/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n/es-ES/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/es-ES/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/es-ES/ve',
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

export default function EsES() {
  return <ProductFamilyLayout {...pageConfig} />;
}
