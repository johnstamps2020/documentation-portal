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
    label: 'Select product',
    selectedItemLabel: 'ContactManager',
    items: allSelectors.sbfa25ca7f841c9f2498e1036db9bc9b2,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Upgrade From 50.7.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.7.0',
    },
    {
      label: 'Upgrade From 50.6.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.6.0',
    },
    {
      label: 'Upgrade From 50.5.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.5.2',
    },
    {
      label: 'Upgrade From 50.5.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.5.1',
    },
    {
      label: 'Upgrade From 50.5.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.5.0',
    },
    {
      label: 'Upgrade From 50.4.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.4.3',
    },
    {
      label: 'Upgrade From 50.4.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.4.2',
    },
    {
      label: 'Upgrade From 50.4.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.4.1',
    },
    {
      label: 'Upgrade From 50.4.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.4.0',
    },
    {
      label: 'Upgrade From 50.3.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.3.2',
    },
    {
      label: 'Upgrade From 50.3.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.3.1',
    },
    {
      label: 'Upgrade From 50.3.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.3.0',
    },
    {
      label: 'Upgrade From 50.2.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.2.1',
    },
    {
      label: 'Upgrade From 50.2.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.2.0',
    },
    {
      label: 'Upgrade From 50.1.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.1.2',
    },
    {
      label: 'Upgrade From 50.1.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.1.1',
    },
    {
      label: 'Upgrade From 50.1.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.1.0',
    },
    {
      label: 'Upgrade From 50.0.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 50.0.0',
    },
    {
      label: 'Upgrade From 10.2.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.2.2',
    },
    {
      label: 'Upgrade From 10.2.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.2.1',
    },
    {
      label: 'Upgrade From 10.2.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.2.0',
    },
    {
      label: 'Upgrade From 10.1.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.1.2',
    },
    {
      label: 'Upgrade From 10.1.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.1.1',
    },
    {
      label: 'Upgrade From 10.1.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.1.0',
    },
    {
      label: 'Upgrade From 10.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.0.3',
    },
    {
      label: 'Upgrade From 10.0.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.0.2',
    },
    {
      label: 'Upgrade From 10.0.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.0.1',
    },
    {
      label: 'Upgrade From 10.0.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 10.0.0',
    },
    {
      label: 'Upgrade From 9.0.10',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.10',
    },
    {
      label: 'Upgrade From 9.0.9',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.9',
    },
    {
      label: 'Upgrade From 9.0.8',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.8',
    },
    {
      label: 'Upgrade From 9.0.7',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.7',
    },
    {
      label: 'Upgrade From 9.0.6',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.6',
    },
    {
      label: 'Upgrade From 9.0.5',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.5',
    },
    {
      label: 'Upgrade From 9.0.4',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.4',
    },
    {
      label: 'Upgrade From 9.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.3',
    },
    {
      label: 'Upgrade From 9.0.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.2',
    },
    {
      label: 'Upgrade From 9.0.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.1',
    },
    {
      label: 'Upgrade From 9.0.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 9.0.0',
    },
    {
      label: 'Upgrade From 8.0.7',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.7',
    },
    {
      label: 'Upgrade From 8.0.6',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.6',
    },
    {
      label: 'Upgrade From 8.0.5',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.5',
    },
    {
      label: 'Upgrade From 8.0.4',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.4',
    },
    {
      label: 'Upgrade From 8.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.3',
    },
    {
      label: 'Upgrade From 8.0.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.2',
    },
    {
      label: 'Upgrade From 8.0.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.1',
    },
    {
      label: 'Upgrade From 8.0.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 8.0.0',
    },
    {
      label: 'Upgrade From 7.0.8',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.8',
    },
    {
      label: 'Upgrade From 7.0.7',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.7',
    },
    {
      label: 'Upgrade From 7.0.6',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.6',
    },
    {
      label: 'Upgrade From 7.0.5',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.5',
    },
    {
      label: 'Upgrade From 7.0.4',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.4',
    },
    {
      label: 'Upgrade From 7.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.3',
    },
    {
      label: 'Upgrade From 7.0.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.2',
    },
    {
      label: 'Upgrade From 7.0.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.1',
    },
    {
      label: 'Upgrade From 7.0.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 7.0.0',
    },
    {
      label: 'Upgrade From 6.0.8',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.8',
    },
    {
      label: 'Upgrade From 6.0.7',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.7',
    },
    {
      label: 'Upgrade From 6.0.6',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.6',
    },
    {
      label: 'Upgrade From 6.0.5',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.5',
    },
    {
      label: 'Upgrade From 6.0.4',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.4',
    },
    {
      label: 'Upgrade From 6.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.3',
    },
    {
      label: 'Upgrade From 6.0.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.2',
    },
    {
      label: 'Upgrade From 6.0.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.1',
    },
    {
      label: 'Upgrade From 6.0.0',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 6.0.0',
    },
    {
      label: 'Upgrade From 5.0.9',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.9',
    },
    {
      label: 'Upgrade From 5.0.8',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.8',
    },
    {
      label: 'Upgrade From 5.0.7',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.7',
    },
    {
      label: 'Upgrade From 5.0.6',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.6',
    },
    {
      label: 'Upgrade From 5.0.5',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.5',
    },
    {
      label: 'Upgrade From 5.0.4',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.4',
    },
    {
      label: 'Upgrade From 5.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.3',
    },
    {
      label: 'Upgrade From 5.0.2',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.2',
    },
    {
      label: 'Upgrade From 5.0.1',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 5.0.1',
    },
    {
      label: 'Upgrade From 4.0.9',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.9',
    },
    {
      label: 'Upgrade From 4.0.8',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.8',
    },
    {
      label: 'Upgrade From 4.0.7',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.7',
    },
    {
      label: 'Upgrade From 4.0.6',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.6',
    },
    {
      label: 'Upgrade From 4.0.5',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.5',
    },
    {
      label: 'Upgrade From 4.0.4',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.4',
    },
    {
      label: 'Upgrade From 4.0.3',
      pagePath: 'upgradediffs/ContactManager/Upgrade From 4.0.3',
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

export default function ContactManager() {
  return <ProductFamilyLayout {...pageConfig} />;
}
