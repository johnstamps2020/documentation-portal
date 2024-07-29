import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-kufri.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import skiReleaseBadge from 'images/badge-kufri.svg';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundAttachment: 'scroll',
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${backgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Kufri',
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
          label: 'Guidewire Home',
          docId: 'gwhomerelease',
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
          pagePath: 'cloudProducts/kufri/pc',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/kufri/cc',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/kufri/bc',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/kufri/in',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/kufri/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/kufri/global-ref-apps',
        },
        {
          label: 'Underwriting Workbench (Early Access)',
          docId: 'uwworkbench',
        },
      ],
    },
    {
      label: 'Analytics',
      items: [
        {
          label: 'DataHub',
          pagePath: 'cloudProducts/kufri/dh',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/kufri/ic',
        },
        {
          label: 'Analytics Manager',
          docId: 'analyticsmanager',
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
          pagePath: 'cloudProducts/kufri/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/kufri',
        },
        {
          label: 'Developing Integration Gateway Apps',
          docId: 'integgatewayfwnext',
        },
        {
          label: 'Administering Integration Gateway Apps',
          docId: 'integgatewayuinext',
        },
        {
          label: 'App Events',
          docId: 'appeventsdevnext',
        },
        {
          label: 'Webhooks',
          docId: 'webhooksnext',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguidenext',
        },
        {
          label: 'Jutro Digital Platform',
          docId: 'jutro1070',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/kufri',
        },
        {
          label: 'Lifecycle Manager',
          docId: 'lifecyclemgr',
        },
        {
          label: 'Workset Manager',
          docId: 'worksetmgr',
        },
        {
          label: 'Business Functions (Early Access)',
          docId: 'businessfunctionsnext',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Kufri',
    badge: skiReleaseBadge,
    item: { label: 'Learn more', docId: 'whatsnewkufri' },
    content: ['Guidewire Home',
      'Add-your-own testing and quality gates',
      'Self-service deployment for EnterpriseEngage apps',
      'Manual pricing in PolicyCenter',
      'Business rule overrides in BillingCenter',
      'Autopilot Workflow Service subflows',
      'InsuranceNow Go for Commercial Umbrella',
      'ISO Rating as a Service in InsuranceNow',
      'HazardHub Web reports',
      'Cyence CyberRisk Model 7',
      'Business Impact Monitoring',
      'Guidewire Data Platform',
    ],
  },
  sidebar: implementationResourcesSidebar,
};

export default function Kufri() {
  return <Category2Layout {...pageConfig} />;
}
