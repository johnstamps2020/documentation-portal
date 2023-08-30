import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import garmischBackgroundImage from 'images/background-garmisch.png';
import garmischBadge from 'images/badge-garmisch.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Garmisch',
    items: allSelectors.sb372c5e3c1cec5d40289c85a78eaef30,
    labelColor: 'white',
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
          label: 'Autopilot Workflow Service (Early Access)',
          pagePath: 'cloudProducts/autopilotworkflowservice',
        },
      ],
    },
    {
      label: 'Applications',
      items: [
        {
          label: 'PolicyCenter',
          pagePath: 'cloudProducts/garmisch/pcGwCloud/2023.02',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/garmisch/ccGwCloud/2023.02',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/garmisch/bcGwCloud/2023.02',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/garmisch/insuranceNow/2023.1',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/garmisch/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/garmisch/global-ref-apps',
        },
      ],
    },
    {
      label: 'Analytics',
      items: [
        {
          label: 'DataHub',
          pagePath: 'cloudProducts/garmisch/dhGwCloud/2023.02',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/garmisch/icGwCloud/2023.02',
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
          pagePath: 'cloudProducts/garmisch/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/garmisch',
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
          pagePath: 'cloudProducts/garmisch/jutroDigitalPlatform',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/garmisch',
        },
        {
          label: 'Workset Manager',
          docId: 'worksetmgr',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Garmisch',
    badge: garmischBadge,
    item: { label: 'Learn more', docId: 'whatsnewgarmisch' },
    content: [
      'Self-service production deployments',
      'Automatic post-deployment testing',
      'Custom monitoring and observability',
      'Cloud API enhancements',
      'Multi-product support in APD',
      'Support for importing loss runs into PolicyCenter',
      'Expanded line of business content',
      'InsuranceNow integration with Hi Marley',
      'Support for One Inc ACH payments in InsuranceNow',
      'New analytics dashboards for Cyence',
      'New analytics model for Predict',
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
