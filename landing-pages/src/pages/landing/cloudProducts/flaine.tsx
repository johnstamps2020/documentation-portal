import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import flaineBackgroundImage from 'images/background-flaine.png';
import gradientBackgroundImage from 'images/background-gradient.svg';
import flaineBadge from 'images/badge-flaine.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Flaine',
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
      ],
    },
    {
      label: 'Applications',
      items: [
        {
          label: 'PolicyCenter',
          pagePath: 'cloudProducts/flaine/pcGwCloud/2022.09',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/flaine/ccGwCloud/2022.09',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/flaine/bcGwCloud/2022.09',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/flaine/insuranceNow/2022.2',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/flaine/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/flaine/global-ref-apps',
        },
      ],
    },
    {
      label: 'Analytics',
      items: [
        {
          label: 'DataHub',
          pagePath: 'cloudProducts/flaine/dhGwCloud/2022.09',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/flaine/icGwCloud/2022.09',
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
          pagePath: 'cloudProducts/flaine/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/flaine',
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
          pagePath: 'cloudProducts/flaine/jutroDigitalPlatform',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/flaine',
        },
        {
          label: 'Workset Manager',
          docId: 'worksetmgr',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Flaine',
    badge: flaineBadge,
    item: { label: 'Learn more', docId: 'whatsnewflaine' },
    content: [
      'Advanced Product Designer app (APD)',
      'Submission Intake for InsuranceSuite',
      'App Events for event-based integration',
      'Community-powered machine learning',
      'Automated updates to latest release',
      'Cloud API enhancements',
      'Early access to Jutro Digital Platform',
      'Expanded Guidewire GO content',
      'Advanced monitoring and observability',
    ],
  },
  sidebar: implementationResourcesSidebar,
};

export default function Flaine() {
  return <Category2Layout {...pageConfig} />;
}
