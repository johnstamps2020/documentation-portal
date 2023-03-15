import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: {
    label: 'Select page',
    selectedItemLabel: 'ClaimCenter Cloud',
    items: [
      {
        label: 'BillingCenter Cloud',
        pagePath: 'cloudProducts/banff/billingCenterCloud',
      },
      {
        label: 'ClaimCenter Cloud',
        pagePath: 'cloudProducts/banff/claimCenterCloud',
      },
      {
        label: 'PolicyCenter Cloud',
        pagePath: 'cloudProducts/banff/policyCenterCloud',
      },
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Core',
      items: [
        {
          label: 'ClaimCenter for Guidewire Cloud',
          pagePath: 'cloudProducts/banff/claimCenterCloud/ccGwCloud/2020.11',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools310',
        },
      ],
    },
    {
      label: 'Analytics',
      items: [
        {
          label: 'Cloud Data Access',
          pagePath: 'cloudProducts/cloudDataAccess/latest',
        },
        {
          label: 'Compare+',
          docId: 'comparelatest',
        },
        {
          label: 'Explore',
          pagePath: 'cloudProducts/explore/latest',
        },
        {
          label: 'Live Predict',
          docId: 'livepredictlatest',
        },
      ],
      sections: [
        {
          label: 'Add-ons',
          items: [
            {
              label: 'DataHub for Guidewire Cloud',
              docId: 'dh202011',
            },
            {
              label: 'InfoCenter for Guidewire Cloud',
              docId: 'ic202011',
            },
          ],
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
              docId: 'dxceam202011',
            },
            {
              label: 'CustomerEngage Account Management for ClaimCenter',
              docId: 'dxceclaims202011',
            },
            {
              label: 'ProducerEngage',
              docId: 'dxpe202011',
            },
            {
              label: 'ProducerEngage for ClaimCenter',
              docId: 'dxpeclaims202011',
            },
            {
              label: 'VendorEngage',
              docId: 'dxve202011',
            },
          ],
        },
        {
          label: 'Digital Framework',
          items: [
            {
              label: 'Jutro Design System',
              pagePath: 'jutroDesignSystem/4.1.1',
            },
          ],
        },
      ],
    },
  ],
};

export default function ClaimCenterCloud() {
  return <CategoryLayout {...pageConfig} />;
}
