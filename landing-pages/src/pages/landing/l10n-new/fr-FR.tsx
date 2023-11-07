import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
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
  sidebar: implementationResourcesSidebar,
};

export default function FrFR() {
  return <ProductFamilyLayout {...pageConfig} />;
}
