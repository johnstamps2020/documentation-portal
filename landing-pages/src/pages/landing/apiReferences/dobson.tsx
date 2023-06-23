import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import dobsonBackgroundImage from 'images/background-dobson.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `url(${dobsonBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Dobson',
    items: [
      { label: 'Banff', pagePath: 'apiReferences/banff' },
      { label: 'Cortina', pagePath: 'apiReferences/cortina' },
      { label: 'Dobson', pagePath: 'apiReferences/dobson' },
      { label: 'Elysian', pagePath: 'apiReferences/elysian' },
      { label: 'Flaine', pagePath: 'apiReferences/flaine' },
      { label: 'Garmisch', pagePath: 'apiReferences/garmisch' },
    ],
    labelColor: 'white',
  },

  items: [
    {
      label: 'InsuranceNow API Reference',
      docId: 'in20212apiref',
    },
    {
      label: 'ClaimCenter API Reference',
      docId: 'ccapirefdobson',
    },
    {
      label: 'PolicyCenter API Reference',
      docId: 'pcapirefdobson',
    },
  ],
  sidebar: {
    label: 'Implementation Resources',
    items: [
      {
        label: 'API References',
        pagePath: 'apiReferences',
      },
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
    ],
  },
};

export default function Dobson() {
  return <ProductFamilyLayout {...pageConfig} />;
}
