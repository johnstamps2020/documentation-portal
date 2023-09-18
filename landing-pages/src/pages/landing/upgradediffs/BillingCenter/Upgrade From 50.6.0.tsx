import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Select version to upgrade from',
    selectedItemLabel: 'Upgrade From 50.6.0',
    items: allSelectors.s65a8f50f5baaf3e8c91f86c0e3b5c1f1,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Upgrade To 50.8.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2050.6.0/Upgrade%20To%2050.8.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.7.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2050.6.0/Upgrade%20To%2050.7.0',
      videoIcon: false,
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

export default function UpgradeFrom5060() {
  return <ProductFamilyLayout {...pageConfig} />;
}
