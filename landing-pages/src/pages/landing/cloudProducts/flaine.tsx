import { baseBackgroundProps } from '..';
import CategoryLayout2, {
  Category2LayoutProps,
} from '../../../components/LandingPage/Category2/Category2Layout';
import gradientBackgroundImage from '../../../images/background-gradient.svg';
import flaineBadge from '../../../images/badge-flaine.svg';
import flaineBackgroundImage from '../../../images/background-flaine.svg';

const docs: Category2LayoutProps['items'] = [
  {
    label: 'Platform',
    items: [
      {
        label: 'Cloud Home',
        docId: 'gchhelprelease',
      },
      {
        label: 'Cloud Platform',
        pagePath: 'cloudProducts/cloudConsole',
      },
      {
        label: 'Data Platform',
        docId: 'dataplatform',
      },
      {
        label: 'Cloud Data Access',
        pagePath: 'cloudProducts/cloudDataAccess/latest',
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
];
const whatsNew: Category2LayoutProps['whatsNewInfo'] = {
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
};
const sidebar: Category2LayoutProps['sidebar'] = {
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
};
const backgroundProps: Category2LayoutProps['backgroundProps'] = {
  ...baseBackgroundProps,
  backgroundImage: {
    xs: `url(${gradientBackgroundImage})`,
    sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
  },
};

export default function Flaine() {
  return (
    <CategoryLayout2
      items={docs}
      whatsNew={whatsNew}
      backgroundProps={backgroundProps}
      sidebar={sidebar}
    />
  );
}
