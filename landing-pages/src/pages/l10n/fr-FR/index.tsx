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
    label: 'Choisir la langue',
    selectedItemLabel: 'Français',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Nouveautés de Kufri',
      docId: 'whatsnewkufrifrFR',
    },
    {
      label: 'Nouveautés de Jasper',
      docId: 'whatsnewjasperfrFR',
    },
    {
      label: "Nouveautés d'Innsbruck",
      docId: 'whatsnewfrFRinnsbruck',
    },
    {
      label: 'Nouveautés de Hakuba',
      docId: 'whatsnewfrFRhakuba',
    },
    {
      label: 'Analytics',
      pagePath: 'l10n/fr-FR/analytics',
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
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n/fr-FR/is-configupgradetools',
    },
    {
      label: 'InsuranceSuite - Notes de version',
      docId: 'isrnfrFRlatest',
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
};

export const Route = createFileRoute('/l10n/fr-FR/')({
  component: FrFR,
});

function FrFR() {
  return <ProductFamilyLayout {...pageConfig} />;
}
