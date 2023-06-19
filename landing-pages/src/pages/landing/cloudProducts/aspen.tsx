import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  items: [
    {
      label: 'PolicyCenter Cloud',
      pagePath: 'cloudProducts/aspen/policyCenterCloud',
    },
    {
      label: 'ClaimCenter Cloud',
      pagePath: 'cloudProducts/aspen/claimCenterCloud',
    },
    {
      label: 'BillingCenter Cloud',
      pagePath: 'cloudProducts/aspen/billingCenterCloud',
    },
    {
      label: 'InsuranceNow',
      pagePath: 'cloudProducts/aspen/insuranceNow/2020.1',
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
  showReleaseSelector: true,
};

export default function Aspen() {
  return <ProductFamilyLayout {...pageConfig} />;
}
