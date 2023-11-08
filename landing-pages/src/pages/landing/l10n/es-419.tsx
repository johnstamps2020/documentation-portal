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
    label: 'Seleccione el idioma',
    selectedItemLabel: 'Español',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Novedades de Hakuba',
      pagePath: 'l10n/es-419/202306hakubawhatsnew',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n/es-419/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/es-419/cc',
    },
    {
      label: 'Cloud Data Access',
      pagePath: 'l10n/es-419/cda',
    },
    {
      label: 'Cloud Platform',
      pagePath: 'l10n/es-419/cp',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/es-419/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/es-419/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/es-419/ce-qb',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n/es-419/dh',
    },
    {
      label: 'Explore',
      docId: 'explorees419usingrelease',
    },
    {
      label: 'Guidewire Cloud Console',
      docId: 'guidewirecloudconsolerootinsurerdeves419',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n/es-419/ic',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/es-419/cm',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/es-419/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/es-419/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n/es-419/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/es-419/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/es-419/ve',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function Es419() {
  return <ProductFamilyLayout {...pageConfig} />;
}
