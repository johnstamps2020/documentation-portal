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
      pagePath: 'l10n-new/es-419/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n-new/es-419/cc',
    },
    {
      label: 'Cloud Data Access',
      pagePath: 'l10n-new/es-419/cda',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n-new/es-419/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n-new/es-419/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n-new/es-419/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n-new/es-419/cm',
    },
    {
      label: 'DataHub',
      pagePath: 'l10n-new/es-419/dh',
    },
    {
      label: 'Explore',
      pagePath: 'l10n-new/es-419/explore',
    },
    {
      label: 'Guidewire Cloud Console',
      pagePath: 'l10n-new/es-419/gcc',
    },
    {
      label: 'InfoCenter',
      pagePath: 'l10n-new/es-419/ic',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n-new/es-419/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n-new/es-419/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n-new/es-419/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n-new/es-419/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n-new/es-419/ve',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function Es419() {
  return <ProductFamilyLayout {...pageConfig} />;
}
