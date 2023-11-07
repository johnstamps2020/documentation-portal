import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { implementationResourcesSidebar } from './common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  items: [
    {
      label: 'BillingCenter',
      pagePath: 'upgradediffs/BillingCenter',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'upgradediffs/ClaimCenter',
    },
    {
      label: 'ContactManager',
      pagePath: 'upgradediffs/ContactManager',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'upgradediffs/PolicyCenter',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function Upgradediffs() {
  return <ProductFamilyLayout {...pageConfig} />;
}
