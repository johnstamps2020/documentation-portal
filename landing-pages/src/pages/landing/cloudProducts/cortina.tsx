import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from '../../../components/LandingPage/ProductFamily/ProductFamilyLayout';
import cortinaBackgroundImage from '../../../images/background-cortina.svg';
import gradientBackgroundImage from '../../../images/background-gradient.svg';
import { baseBackgroundProps } from '../../LandingPage/LandingPage';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      sm: `url(${cortinaBackgroundImage})`,
      xs: `url(${gradientBackgroundImage})`,
    },
  },
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

export default function Cortina() {
  return <ProductFamilyLayout {...pageConfig} />;
}
