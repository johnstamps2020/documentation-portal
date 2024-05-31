import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import elysianBackgroundImage from 'images/background-elysian.png';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `url(${elysianBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Elysian',
    items: allSelectors.sb372c5e3c1cec5d40289c85a78eaef30,
    labelColor: 'white',
  },
  isRelease: true,

  cards: [
    {
      label: 'Applications',
      items: [
        {
          label: 'PolicyCenter',
          pagePath: 'cloudProducts/elysian/pcGwCloud/2022.05',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'cloudProducts/elysian/ccGwCloud/2022.05',
        },
        {
          label: 'BillingCenter',
          pagePath: 'cloudProducts/elysian/bcGwCloud/2022.05',
        },
        {
          label: 'InsuranceNow',
          pagePath: 'cloudProducts/elysian/insuranceNow/2022.1',
        },
        {
          label: 'Guidewire for Salesforce',
          pagePath: 'cloudProducts/elysian/gwsf',
        },
        {
          label: 'InsuranceSuite Package for Australia',
          pagePath: 'globalContent/ipa/2022.09',
        },
      ],
    },
    {
      label: 'Data and Analytics',
      items: [
        {
          label: 'Data Platform',
          pagePath: 'cloudProducts/dataPlatform',
        },
        {
          label: 'DataHub',
          pagePath: 'cloudProducts/elysian/dhGwCloud/2022.05',
        },
        {
          label: 'InfoCenter',
          pagePath: 'cloudProducts/elysian/icGwCloud/2022.05',
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
          label: 'Cyence',
          pagePath: 'cloudProducts/cyence',
        },
        {
          label: 'Explore',
          docId: 'exploreusingrelease',
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
      ],
    },
    {
      label: 'Digital',
      sections: [
        {
          label: 'Digital Reference Applications',
          items: [
            {
              label: 'CustomerEngage Account Management',
              pagePath: 'cloudProducts/elysian/ceAccountMgmt/2022.05',
            },
            {
              label: 'CustomerEngage Account Management for ClaimCenter',
              pagePath: 'cloudProducts/elysian/ceAccountMgmtCc/2022.05',
            },
            {
              label: 'CustomerEngage Quote and Buy',
              pagePath: 'cloudProducts/elysian/ceQuoteAndBuy/2022.05',
            },
            {
              label: 'ProducerEngage',
              pagePath: 'cloudProducts/elysian/producerEngage/2022.05',
            },
            {
              label: 'ProducerEngage for ClaimCenter',
              pagePath: 'cloudProducts/elysian/producerEngageCc/2022.05',
            },
            {
              label: 'ServiceRepEngage',
              pagePath: 'cloudProducts/elysian/serviceRepEngage/2022.05',
            },
            {
              label: 'VendorEngage',
              pagePath: 'cloudProducts/elysian/vendorEngage/2022.05',
            },
          ],
        },
        {
          label: 'Jutro Design System 7.4.3',
          items: [
            {
              label: 'Jutro Design System and UI Framework',
              docId: 'jutro743',
            },
            {
              label: 'Jutro Storybook',
              docId: 'storybook743',
            },
          ],
        },
      ],
    },
    {
      label: 'Guidewire Cloud Platform',
      items: [
        {
          label: 'Cloud Console',
          docId: 'guidewirecloudconsolerootinsurerdev',
        },
        {
          label: 'Guidewire Home',
          docId: 'gwhomerelease',
        },
      ],
      sections: [
        {
          label: 'Cloud Infrastructure',
          items: [
            {
              label: 'Release Notes',
              docId: 'gwcpreleasenotes',
            },
            {
              label: 'Authentication',
              docId: 'guidewireidentityfederationhub',
            },
            {
              label: 'Network Connectivity',
              docId: 'cloudplatformrelease',
            },
          ],
        },
      ],
    },
    {
      label: 'Developer Resources',
      items: [
        {
          label: 'API References',
          pagePath: 'apiReferences/elysian',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
        },
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/elysian',
        },
      ],
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function Elysian() {
  return <CategoryLayout {...pageConfig} />;
}
