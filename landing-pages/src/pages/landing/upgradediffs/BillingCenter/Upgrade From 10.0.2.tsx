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
    selectedItemLabel: 'Upgrade From 10.0.2',
    items: allSelectors.s65a8f50f5baaf3e8c91f86c0e3b5c1f1,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Upgrade To 50.8.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.8.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.7.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.7.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.6.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.6.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.5.2',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.5.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.5.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.5.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.5.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.5.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.4.3',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.4.3',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.4.2',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.4.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.4.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.4.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.4.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.4.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.3.2',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.3.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.3.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.3.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.3.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.3.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.2.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.2.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.2.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.2.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.1.2',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.1.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.1.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.1.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.1.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.1.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 50.0.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2050.0.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.2.2',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.2.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.2.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.2.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.2.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.2.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.1.2',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.1.2',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.1.1',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.1.1',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.1.0',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.1.0',
      videoIcon: false,
    },
    {
      label: 'Upgrade To 10.0.3',
      url: '/upgradediffs/BillingCenter/Upgrade%20From%2010.0.2/Upgrade%20To%2010.0.3',
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

export default function UpgradeFrom1002() {
  return <ProductFamilyLayout {...pageConfig} />;
}
