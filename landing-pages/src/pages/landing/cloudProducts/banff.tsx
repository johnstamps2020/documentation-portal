import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import banffBackgroundImage from 'images/background-banff.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      sm: `url(${banffBackgroundImage}), url(${gradientBackgroundImage})`,
      xs: `url(${gradientBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Banff',
    items: allSelectors.sde180aec65620690fc9f929603e08d2c,
    labelColor: 'white',
  },
  isRelease: true,
  items: [
    {
      label: 'PolicyCenter Cloud',
      pagePath: 'cloudProducts/banff/policyCenterCloud',
    },
    {
      label: 'ClaimCenter Cloud',
      pagePath: 'cloudProducts/banff/claimCenterCloud',
    },
    {
      label: 'BillingCenter Cloud',
      pagePath: 'cloudProducts/banff/billingCenterCloud',
    },
    {
      label: 'InsuranceNow',
      pagePath: 'cloudProducts/banff/insuranceNow/2020.2',
    },
    {
      label: 'Guidewire Cloud Platform',
      pagePath: 'cloudProducts/guidewireCloudPlatform',
    },
    {
      label: 'Integration Framework',
      docId: 'isrestapiclientguide',
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
