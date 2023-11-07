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
      label: 'Advanced Product Designer',
      pagePath: 'l10n-new/es-ES/apd',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n-new/es-ES/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/es-ES/cc',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/es-ES/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/es-ES/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/es-ES/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n-new/es-ES/cm',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/es-ES/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/es-ES/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n-new/es-ES/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/es-ES/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/es-ES/ve',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function EsES() {
  return <ProductFamilyLayout {...pageConfig} />;
}
