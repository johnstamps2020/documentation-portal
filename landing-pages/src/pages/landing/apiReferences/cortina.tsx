import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import cortinaBackgroundImage from 'images/background-cortina.svg';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      sm: `url(${cortinaBackgroundImage})`,
      xs: `url(${gradientBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select release',
    selectedItemLabel: 'Cortina',
    items: [
      { label: 'Banff', pagePath: 'apiReferences/banff' },
      { label: 'Cortina', pagePath: 'apiReferences/cortina' },
      { label: 'Dobson', pagePath: 'apiReferences/dobson' },
      { label: 'Elysian', pagePath: 'apiReferences/elysian' },
      { label: 'Flaine', pagePath: 'apiReferences/flaine' },
    ],
    labelColor: 'white',
  },
  items: [
    {
      label: 'InsuranceNow API Reference',
      docId: 'in20211apiref',
    },
    {
      label: 'ClaimCenter API Reference',
      docId: 'cc202104apiref',
    },
    {
      label: 'PolicyCenter API Reference',
      docId: 'pc202104apiref',
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
  releaseSelector: true,
};

export default function Cortina() {
  return <ProductFamilyLayout {...pageConfig} />;
}
