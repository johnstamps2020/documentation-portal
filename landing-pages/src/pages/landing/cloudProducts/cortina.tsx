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
    items: allSelectors.sb372c5e3c1cec5d40289c85a78eaef30,
    labelColor: 'white',
  },
  isRelease: true,
  items: [
    {
      label: 'PolicyCenter Cloud',
      pagePath: 'cloudProducts/cortina/policyCenterCloud',
    },
    {
      label: 'ClaimCenter Cloud',
      pagePath: 'cloudProducts/cortina/claimCenterCloud',
    },
    {
      label: 'BillingCenter Cloud',
      pagePath: 'cloudProducts/cortina/billingCenterCloud',
    },
    {
      label: 'InsuranceNow',
      pagePath: 'cloudProducts/cortina/insuranceNow/2021.1',
    },
    {
      label: 'Guidewire Cloud Platform',
      pagePath: 'cloudProducts/guidewireCloudPlatform',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function Cortina() {
  return <ProductFamilyLayout {...pageConfig} />;
}
