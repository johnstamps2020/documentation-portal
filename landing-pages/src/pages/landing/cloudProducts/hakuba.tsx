import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import hakubaBackgroundImage from 'images/background-hakuba.svg';
import hakubaBadge from 'images/badge-hakuba.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${hakubaBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba',
    items: allSelectors.sb372c5e3c1cec5d40289c85a78eaef30,
    labelColor: 'white',
  },
  isRelease: true,
  cards: [
    {
      label: 'Platform',
      items: [
        {
          label: 'Cloud Platform',
          docId: 'guidewirecloudconsolerootinsurerdev',
        },
        {
          label: 'Cloud Home',
          docId: 'gchhelprelease',
        },
        {
          label: 'Guidewire Home',
          docId: 'gwhomerelease'
        },
        {
          label: 'Data Platform',
          pagePath: 'cloudProducts/dataPlatform',
        },
        {
          label: 'Autopilot Workflow Service',
          pagePath: 'cloudProducts/autopilotworkflowservice',
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
          docId: 'exploreusingrelease',
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
          docId: 'hazardhub',
          pathInDoc: 'HazardHub_Intro_gw.pdf',
          videoIcon: false,
        },
        {
          label: 'Predict',
          docId: 'livepredictlatest',
        },
        {
          label: 'Predict Upgrade',
          docId: 'livepredictupgrade',
        },
        {
          label: 'Cyence Cyber',
          pagePath: 'cloudProducts/cyence',
        },
        {
          label: 'Data Studio',
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
          label: 'Webhooks',
          docId: 'webhooksrelease',
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
    badge: hakubaBadge,
    item: { label: 'Learn more', docId: 'whatsnewhakuba' },
    content: [
      'Integration Data Manager for third-party data storage',
      'Real-time monitoring of cloud services by region',
      'Multi-currency support for global commercial lines',
      'APD App rate modifiers for premium adjustments',
      'Cloud API enhancements',
      'InsuranceNow Data Service Console',
      'One Inc ClaimsPay® integration with InsuranceNow',
      'London Market programmes and journal financials',
      'Cyence Model 6',
    ],
  },
  sidebar: implementationResourcesSidebar,
};

export default function Hakuba() {
  return <Category2Layout {...pageConfig} />;
}
