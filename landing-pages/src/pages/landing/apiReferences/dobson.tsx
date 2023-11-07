import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import dobsonBackgroundImage from 'images/background-dobson.svg';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

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
    items: allSelectors.s0f196c0b55cf55f2cdd1e05b1bf5e94e,
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
  sidebar: implementationResourcesSidebar,
};

export default function Dobson() {
  return <ProductFamilyLayout {...pageConfig} />;
}
