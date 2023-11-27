import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import innsbruckBackgroundImage from 'images/background-innsbruck.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import innsbruckBadge from 'images/badge-innsbruck.svg';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${innsbruckBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck',
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
          pagePath: 'cloudProducts/innsbruck/pcGwCloud/2023.10',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/innsbruck/ccGwCloud/2023.10',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/innsbruck/bcGwCloud/2023.10',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/innsbruck/insuranceNow/2023.3',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/innsbruck/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/innsbruck/global-ref-apps',
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
          pagePath: 'cloudProducts/innsbruck/dhGwCloud/2023.10',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/innsbruck/icGwCloud/2023.10',
        },
        {
          label: 'Analytics Manager',
          docId: 'analyticsmanager',
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
          pagePath: 'cloudProducts/innsbruck/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/innsbruck',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevnext',
        },
        {
          label: 'App Events',
          docId: 'appeventsdevnext',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguidenext',
        },
        {
          label: 'Jutro Digital Platform (Early Access)',
          docId: 'jutro1000',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/innsbruck',
        },
        {
          label: 'Lifecycle Manager',
          docId: 'lifecyclemgr',
        },
        {
          label: 'Workset Manager',
          docId: 'worksetmgr',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Innsbruck',
    badge: innsbruckBadge,
    item: { label: 'Learn more', docId: 'whatsnewinnsbruck' },
    content: ['Coming soon'],
  },
  sidebar: implementationResourcesSidebar,
};

export default function Innsbruck() {
  return <Category2Layout {...pageConfig} />;
}
