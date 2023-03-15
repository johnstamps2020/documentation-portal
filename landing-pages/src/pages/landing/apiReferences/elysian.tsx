import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import elysianBackgroundImage from 'images/background-elysian.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `url(${elysianBackgroundImage})`,
    },
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'API Reference',
          docId: 'bcapirefelysian',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'isbc202205apibf',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'API Reference',
          docId: 'ccapirefelysian',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'iscc202205apica',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'iscc202205apibf',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'API Reference',
          docId: 'pcapirefelysian',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'ispc202205apica',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'ispc202205apibf',
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
      ],
    },
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'API Reference',
          docId: 'in20221apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20221portaldev',
        },
      ],
    },
  ],

  sidebar: {
    label: 'Implementation Resources',
    items: [
      {
        label: 'Guidewire Testing',
        pagePath: 'testingFramework/elysian',
      },
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

export default function Elysian() {
  return <CategoryLayout {...pageConfig} />;
}
