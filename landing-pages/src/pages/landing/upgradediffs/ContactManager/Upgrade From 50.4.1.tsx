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
    selectedItemLabel: 'Upgrade From 50.4.1',
    items: allSelectors.sa288a848df7d818862b837a92f8ca01a,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Upgrade To 50.8.0',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.8.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.7.0',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.7.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.6.0',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.6.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.5.2',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.5.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.5.1',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.5.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.5.0',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.5.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.4.3',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.4.3',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.4.2',
      url: '/upgradediffs/ContactManager/Upgrade%20From%2050.4.1/Upgrade%20To%2050.4.2',
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

export default function UpgradeFrom5041() {
  return <ProductFamilyLayout {...pageConfig} />;
}