import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import garmischBackgroundImage from 'images/background-garmisch.png';
import garmischBadge from 'images/badge-garmisch.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${garmischBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapirefgarmisch',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202302apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202302apica',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefgarmisch',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202302apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202302apica',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefgarmisch',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202302apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202302apica',
        },
      ],
    },
    {
      label: 'APD API Reference',
      items: [
        {
          label: 'API Reference',
          docId: 'apdmaindoc',
        },
      ],
    },
    {
      label: 'Cloud Console',
      items: [
        {
          label: 'CI/CD Manager API',
          docId: 'cicdmanagerapiref',
        },
        {
          label: 'Cloud Console API',
          docId: 'cloudconsoleapi',
        },
        {
          label: 'Repository Settings API',
          docId: 'repositorysettingsapi',
        },
        {
          label: 'Runtime Properties API',
          docId: 'runtimepropertiesapi',
        },
      ],
    },
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'API Reference',
          docId: 'in20222apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20222portaldev',
        },
      ],
    },
    {
      label: 'Integration Framework',
      items: [
        {
          label: 'Webhooks API Reference',
          docId: 'webhooksapinext',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Garmisch',
    badge: garmischBadge,
    item: { label: 'Learn more', docId: 'whatsnewgarmisch' },
    content: [
      'Washes your car',
      'Folds the laundry',
      'Enhances the flavor of your food',
      'Makes you feel like a million bucks',
      'Just kidding! Content coming soon.',
    ],
  },
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

export default function Garmisch() {
  return <Category2Layout {...pageConfig} />;
}
