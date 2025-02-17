import { createFileRoute } from '@tanstack/react-router';
import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import jasperBackgroundImage from 'images/background-jasper.svg';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';
import jasperBadge from 'images/badge-jasper.svg';
import { implementationResourcesSidebar } from 'components/sidebars';

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
    selectedItemLabel: 'Jasper',
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
          pagePath: 'cloudProducts/jasper/pc',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/jasper/cc',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/jasper/bc',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/jasper/in',
        },
        {
          label: 'Digital Reference Applications',
          pagePath: 'cloudProducts/jasper/dx-ref-apps',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/jasper/global-ref-apps',
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
          pagePath: 'cloudProducts/jasper/apd',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences/jasper',
        },
        {
          label: 'Developing Integration Gateway Apps',
          docId: 'integgatewayfwjasperrelease',
        },
        {
          label: 'Administering Integration Gateway Apps',
          docId: 'integgatewayuirelease',
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
          label: 'Jutro Digital Platform',
          docId: 'jutro1030',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/jasper',
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
          docId: 'businessfunctionsrelease',
        },
        {
          label: 'Decision Platform (Early Access)',
          docId: 'decisionplatformrelease',
        },
      ],
    },
  ],
  whatsNew: {
    label: 'Jasper',
    badge: jasperBadge,
    item: { label: 'Learn more', docId: 'whatsnewjasper' },
    content: [
      'Layered coinsurance agreements in PolicyCenter and BillingCenter',
      'Analytics Manager pre-integrated into PolicyCenter',
      'Auto and driver schedule import for Submission Intake',
      'Automated Quote Comparison in InsuranceNow',
      'Jutro template for Personal Auto FNOL',
      'Autopilot Workflow Service template for Auto Physical Damage',
      'Predict Tune component (Early Access)',
      'Cloud API updates',
    ],
  },
  sidebar: implementationResourcesSidebar,
};

export const Route = createFileRoute('/cloudProducts/jasper/')({
  component: Jasper,
});

function Jasper() {
  return <Category2Layout {...pageConfig} />;
}
