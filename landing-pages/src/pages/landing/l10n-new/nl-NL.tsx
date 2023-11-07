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
      label: 'ClaimCenter',
      pagePath: 'l10n-new/nl-NL/cc',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function NlNL() {
  return <ProductFamilyLayout {...pageConfig} />;
}
