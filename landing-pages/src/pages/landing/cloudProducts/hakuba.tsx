import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  isRelease: true,
  cards: [
    {
      label: 'Platform',
      items: [
        {
          label: 'Cloud Home',
          docId: 'gchhelprelease',
        },
        {
          label: 'Cloud Platform',
          docId: 'guidewirecloudconsolerootinsurerdev',
        },
        {
          label: 'Data Platform',
          pagePath: 'cloudProducts/dataPlatform',
        },
        {
          label: 'Workflow Service (Early Access)',
          pagePath: 'cloudProducts/workflowservice',
        },
      ],
    },
    {
      label: 'Applications',
      items: [
        {
          label: 'PolicyCenter',
          pagePath: 'cloudProducts/hakuba/pcGwCloud/2023.06',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/hakuba/ccGwCloud/2023.06',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/hakuba/bcGwCloud/2023.06',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/hakuba/insuranceNow/2023.2',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/hakuba/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/hakuba/global-ref-apps',
        },
      ],
    },
    {
      label: 'Analytics',
      items: [
        {
          label: 'DataHub',
          pagePath: 'cloudProducts/hakuba/dhGwCloud/2023.06',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/hakuba/icGwCloud/2023.06',
        },
        {
          label: 'Explore',
          pagePath: 'cloudProducts/explore/latest',
        },
        {
          label: 'Canvas',
          docId: 'canvas',
        },
        {
          label: 'Compare',
          docId: 'comparelatest',
        },
        {
          label: 'HazardHub',
          url: '/hazardhub/HazardHub_Intro_gw.pdf',
          videoIcon: false,
        },
        {
          label: 'Predict',
          docId: 'livepredictlatest',
        },
        {
          label: 'Predict (Post-7x)',
          docId: 'livepredictpost7x',
        },
        {
          label: 'Cyence Cyber',
          pagePath: 'cloudProducts/cyence',
        },
        {
          label: 'Data Studio (Early Access)',
          docId: 'datastudiorelease',
        },
      ],
    },
    {
      label: 'Developer Resources',
      items: [
        {
          label: 'Advanced Product Designer App',
          pagePath: 'cloudProducts/hakuba/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/hakuba',
        },
        {
          label: 'API Sandbox',
          docId: 'is202306apisandbox',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'App Events',
          docId: 'appeventsdev',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
        },
        {
          label: 'Jutro Digital Platform (Early Access)',
          pagePath: 'cloudProducts/hakuba/jutroDigitalPlatform',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/hakuba',
        },
        {
          label: 'Workset Manager',
          docId: 'worksetmgr',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Hakuba',
    badge: '',
    item: { label: 'Learn more', docId: 'whatsnewgarmisch' },
    content: ['Content coming soon'],
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

export default function Hakuba() {
  return <Category2Layout {...pageConfig} />;
}
