import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import jasperBackgroundImage from 'images/background-jasper.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import jasperBadge from 'images/badge-jasper.svg';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${jasperBackgroundImage}), 
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
          pagePath: 'cloudProducts/jasper/dx-ref-apps',
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
          pagePath: 'cloudProducts/jasper/dh',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/jasper/ic',
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
          docId: 'jutro1030',
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
      ],
    },
  ],
  whatsNew: {
    label: 'Kufri',
    badge: jasperBadge,
    item: { label: 'Learn more', docId: 'whatsnewjasper' },
    content: [
      'Coming soon',
      'Many links yet to be updated'
  ],
  },
  sidebar: implementationResourcesSidebar,
};

export default function Kufri() {
  return <Category2Layout {...pageConfig} />;
}
