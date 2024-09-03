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
    label: 'Seleziona la lingua',
    selectedItemLabel: 'Italiano',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Analytics',
      pagePath: 'l10n/it-IT/analytics',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n/it-IT/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/it-IT/cc',
    },
    {
      label: 'Cloud Data Access',
      pagePath: 'l10n/it-IT/cda',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/it-IT/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/it-IT/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/it-IT/ce-qb',
    },
    {
      label: 'Guidewire Cloud Console',
      pagePath: 'l10n/it-IT/gcc',
    },
    {
      label: 'Guidewire Identity Federation Hub',
      pagePath: 'l10n/it-IT/gwid',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/it-IT/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/it-IT/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n/it-IT/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/it-IT/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/it-IT/ve',
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT')({
  component: ItIT,
});

function ItIT() {
  return <ProductFamilyLayout {...pageConfig} />;
}
