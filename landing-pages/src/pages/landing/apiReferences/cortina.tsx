import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import cortinaBackgroundImage from 'images/background-cortina.svg';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      sm: `url(${cortinaBackgroundImage})`,
      xs: `url(${gradientBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Cortina',
    items: allSelectors.s0f196c0b55cf55f2cdd1e05b1bf5e94e,
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
  sidebar: implementationResourcesSidebar,
};

export default function Cortina() {
  return <ProductFamilyLayout {...pageConfig} />;
}
