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
      pagePath: 'l10n-new/it-IT/apd',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n-new/it-IT/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/it-IT/cc',
    },
    {
      label: 'Cloud Data Access',
      pagePath: 'l10n-new/it-IT/cda',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/it-IT/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/it-IT/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/it-IT/ce-qb',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n-new/it-IT/dh',
    },
    {
      label: 'Guidewire Cloud Console',
      pagePath: 'l10n-new/it-IT/gcc',
    },
    {
      label: 'Guidewire Identity Federation Hub',
      pagePath: 'l10n-new/it-IT/gwid',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n-new/it-IT/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/it-IT/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/it-IT/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n-new/it-IT/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/it-IT/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/it-IT/ve',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function ItIT() {
  return <ProductFamilyLayout {...pageConfig} />;
}
