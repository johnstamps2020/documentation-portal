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
    label: 'Selecione o idioma',
    selectedItemLabel: 'Português',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Novidades na Kufri',
      docId: 'whatsnewkufriptBR',
    },
    {
      label: 'Novidades na Jaspser',
      docId: 'whatsnewjasperptBR',
    },
    {
      label: 'Novidades na Innsbruck',
      docId: 'whatsnewptBRinnsbruck',
    },
    {
      label: 'Novidades na Hakuba',
      docId: 'whatsnewptBRhakuba',
    },
    {
      label: 'Analytics',
      pagePath: 'l10n/pt-BR/analytics',
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
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n/pt-BR/is-configupgradetools',
    },
    {
      label: 'InsuranceSuite - Notas de versão',
      docId: 'isrnptBRlatest',
    },
    {
      label: 'Guidewire Cloud Console',
      docId: 'guidewirecloudconsolerootinsurerdevptBR',
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
};

export const Route = createFileRoute('/l10n/pt-BR/')({
  component: PtBR,
});

function PtBR() {
  return <ProductFamilyLayout {...pageConfig} />;
}
