import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck',
    items: allSelectors.sb372c5e3c1cec5d40289c85a78eaef30,
    labelColor: 'white',
  },
  searchFilters: { platform: ['Cloud'] },
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
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/innsbruck/insuranceNow/2023.3',
        },
        {
          label: 'Global Content Reference Applications',
          pagePath: 'cloudProducts/innsbruck/global-ref-apps',
        },
      ],
    },
    {
      label: 'Analytics',
      items: [
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
          pagePath: 'cloudProducts/innsbruck/jutroDigitalPlatform',
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

export default function Innsbruck() {
  return <CategoryLayout {...pageConfig} />;
}
