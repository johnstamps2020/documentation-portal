import { createFileRoute } from '@tanstack/react-router';
import { allSelectors } from 'components/allSelectors';
import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { implementationResourcesSidebar } from 'components/sidebars';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-laslenas.png';
import skiReleaseBadge from 'images/badge-laslenas.svg';

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
    selectedItemLabel: 'Las Leñas',
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
          pagePath: 'cloudProducts/laslenas/pc',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/laslenas/cc',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/laslenas/bc',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/laslenas/in',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/laslenas/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/laslenas/globalRefApps',
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
        // {
        //   label: 'DataHub',
        //   pagePath: 'cloudProducts/laslenas/dh',
        // },
        // {
        //   label: 'InfoCenter',
        //   pagePath: 'cloudProducts/laslenas/ic',
        // },
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
          pagePath: 'cloudProducts/laslenas/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/laslenas',
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
          docId: 'jutro1090',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/laslenas',
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
        {
          label: 'Decision Platform (Early Access)',
          docId: 'decisionplatformrelease',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Las Leñas',
    badge: skiReleaseBadge,
    item: { label: 'Learn more', docId: 'whatsnewkufri' },
    content: ['Coming soon'],
  },
  sidebar: implementationResourcesSidebar,
};

export const Route = createFileRoute('/cloudProducts/laslenas/')({
  component: LasLenas,
});

export default function LasLenas() {
  return <Category2Layout {...pageConfig} />;
}
