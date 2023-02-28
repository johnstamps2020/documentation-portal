import { baseBackgroundProps } from '..';
import CategoryLayout, {
  CategoryLayoutProps,
} from '../../../components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from '../../../images/background-gradient.svg';
import elysianBackgroundImage from '../../../images/background-elysian.svg';

const docs: CategoryLayoutProps['cards'] = [
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
        label: 'Cloud Data Access',
        pagePath: 'cloudProducts/cloudDataAccess/latest',
      },
      {
        label: 'Data Platform',
        docId: 'dataplatform',
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
        pagePath: 'cloudProducts/explore/latest',
      },
      {
        label: 'HazardHub',
        url: 'hazardhub/HazardHub_Intro_gw.pdf',
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
        label: 'Cloud Home',
        docId: 'gchhelprelease',
      },
      {
        label: 'Cloud Console',
        pagePath: 'cloudProducts/cloudConsole',
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
      {
        label: 'Integration Framework',
        items: [
          {
            label: 'Integration Gateway',
            docId: 'integgatewaydevlatest',
          },
        ],
      },
    ],
  },
];

const sidebar: CategoryLayoutProps['sidebar'] = {
  label: 'Implementation Resources',
  items: [
    {
      label: 'Guidewire Testing',
      pagePath: 'testingFramework/elysian',
    },
    {
      label: 'API References',
      pagePath: 'apiReferences',
    },
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
  ],
};

const backgroundProps: CategoryLayoutProps['backgroundProps'] = {
  ...baseBackgroundProps,
  backgroundImage: {
    xs: `url(${gradientBackgroundImage})`,
    sm: `url(${elysianBackgroundImage})`,
  },
};

export default function Elysian() {
  return (
    <CategoryLayout
      cards={docs}
      backgroundProps={backgroundProps}
      sidebar={sidebar}
    />
  );
}
