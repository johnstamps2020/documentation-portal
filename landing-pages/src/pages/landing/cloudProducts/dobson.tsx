import CategoryLayout, {
  CategoryLayoutProps,
} from '../../../components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from '../../../images/background-gradient.svg';
import dobsonBackgroundImage from '../../../images/background-dobson.svg';
import { baseBackgroundProps } from '../../LandingPage/LandingPage';

const docs: CategoryLayoutProps['cards'] = [
  {
    label: 'Applications',
    items: [
      {
        label: 'PolicyCenter',
        pagePath: 'cloudProducts/dobson/pcGwCloud/2021.11',
      },
      {
        label: 'ClaimCenter',
        pagePath: 'cloudProducts/dobson/ccGwCloud/2021.11',
      },
      {
        label: 'BillingCenter',
        pagePath: 'cloudProducts/dobson/bcGwCloud/2021.11',
      },
      {
        label: 'InsuranceNow',
        pagePath: 'cloudProducts/dobson/insuranceNow/2021.2',
      },
      {
        label: 'Guidewire for Salesforce',
        pagePath: 'cloudProducts/dobson/gwsf',
      },
      {
        label: 'InsuranceSuite Package for Australia',
        pagePath: 'globalContent/ipa/1.0',
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
        label: 'DataHub',
        pagePath: 'cloudProducts/dobson/dhGwCloud/2021.11',
      },
      {
        label: 'InfoCenter',
        pagePath: 'cloudProducts/dobson/icGwCloud/2021.11',
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
        label: 'Explore (Spanish)',
        pagePath: 'cloudProducts/explore/es-419',
      },
      {
        label: 'HazardHub',
        url: '/hazardhub/HazardHub_Intro_gw.pdf',
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
            pagePath: 'cloudProducts/dobson/ceAccountMgmt/2021.11',
          },
          {
            label: 'CustomerEngage Account Management for ClaimCenter',
            pagePath: 'cloudProducts/dobson/ceAccountMgmtCc/2021.11',
          },
          {
            label: 'CustomerEngage Quote and Buy',
            pagePath: 'cloudProducts/dobson/ceQuoteAndBuy/2021.11',
          },
          {
            label: 'ProducerEngage',
            pagePath: 'cloudProducts/dobson/producerEngage/2021.11',
          },
          {
            label: 'ProducerEngage for ClaimCenter',
            pagePath: 'cloudProducts/dobson/producerEngageCc/2021.11',
          },
          {
            label: 'ServiceRepEngage',
            pagePath: 'cloudProducts/dobson/serviceRepEngage/2021.11',
          },
          {
            label: 'VendorEngage',
            pagePath: 'cloudProducts/dobson/vendorEngage/2021.11',
          },
        ],
      },
      {
        label: 'Digital Framework',
        items: [
          {
            label: 'Jutro Design System',
            pagePath: 'jutroDesignSystem/6.5.1',
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
  {
    label: 'Global Content',
    items: [
      {
        label: 'London Market',
        pagePath: 'globalContent/iplm/3.2',
      },
    ],
  },
];

const sidebar: CategoryLayoutProps['sidebar'] = {
  label: 'Implementation Resources',
  items: [
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
    sm: `url(${dobsonBackgroundImage})`,
  },
};

export default function Dobson() {
  return (
    <CategoryLayout
      cards={docs}
      backgroundProps={backgroundProps}
      sidebar={sidebar}
    />
  );
}
