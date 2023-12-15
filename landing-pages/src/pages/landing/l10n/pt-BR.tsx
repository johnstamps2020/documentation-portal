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
    label: 'Selecione o idioma',
    selectedItemLabel: 'Português',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Novidades na Hakuba',
      docId: 'whatsnewptBRhakuba',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n/pt-BR/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/pt-BR/cc',
    },
    {
      label: 'Cloud Data Access',
      docId: 'clouddataaccessguideptBR',
    },
    {
      label: 'Cloud Platform',
      pagePath: 'l10n/pt-BR/cp',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/pt-BR/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/pt-BR/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/pt-BR/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/pt-BR/cm',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n/pt-BR/dh',
    },
    {
      label: 'Explore',
      docId: 'exploreptBRusingrelease',
    },
    {
      label: 'Guidewire Cloud Console',
      docId: 'guidewirecloudconsolerootinsurerdevptBR',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n/pt-BR/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/pt-BR/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/pt-BR/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n/pt-BR/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/pt-BR/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/pt-BR/ve',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function PtBR() {
  return <ProductFamilyLayout {...pageConfig} />;
}
