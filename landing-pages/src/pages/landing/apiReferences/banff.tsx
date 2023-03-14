import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import banffBackgroundImage from 'images/background-banff.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      sm: `url(${banffBackgroundImage}), url(${gradientBackgroundImage})`,
      xs: `url(${gradientBackgroundImage})`,
    },
  },
  items: [
    {
      label: 'ClaimCenter API Reference',
      docId: 'cc202011apiref',
    },
  ],
  sidebar: {
    label: 'Implementation Resources',
    items: [
      {
        label: 'Community Case Templates',
        docId: 'cloudtickettemplates',
      },
      {
        label: 'Product Adoption',
        docId: 'surepathmethodologymain',
      },
      {
        label: 'Cloud Standards',
        docId: 'standardslatest',
      },
      {
        label: 'Upgrade Diff Reports',
        pagePath: 'upgradediffs',
      },
      {
        label: 'Internal docs',
        docId: 'internaldocslatest',
      },
    ],
  },
};

export default function Banff() {
  return <ProductFamilyLayout {...pageConfig} />;
}
