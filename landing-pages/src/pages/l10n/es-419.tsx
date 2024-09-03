import { createFileRoute } from '@tanstack/react-router';
import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

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
      label: 'Novedades de Kufri',
      docId: 'whatsnewkufries419',
    },
    {
      label: 'Novedades de Jasper',
      docId: 'whatsnewjasperes419',
    },
    {
      label: 'Novedades de Innsbruck',
      docId: 'whatsnewes419innsbruck',
    },
    {
      label: 'Novedades de Hakuba',
      docId: 'whatsnewes419hakuba',
    },
    {
      label: 'Analytics',
      pagePath: 'l10n/es-419/analytics',
    },
    {
      label: 'Advanced Product Designer',
      pagePath: 'l10n/es-419/apd',
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
      label: 'Guidewire Cloud Console',
      docId: 'guidewirecloudconsolerootinsurerdeves419',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/es-419/cm',
    },
    {
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n/es-419/is-configupgradetools',
    },
    {
      label: 'InsuranceSuite Notas de la versión',
      docId: 'isrnes419latest',
    },
    {
      label: 'Plantillas de Community Case',
      docId: 'cloudtickettemplates',
      pathInDoc: 'es-419',
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
};

export const Route = createFileRoute('/l10n/es-419')({
  component: Es419,
});

function Es419() {
  return <ProductFamilyLayout {...pageConfig} />;
}
