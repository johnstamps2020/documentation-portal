import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import dobsonBackgroundImage from 'images/background-dobson.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
    selectedItemLabel: 'Dobson (2021.11)',
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
