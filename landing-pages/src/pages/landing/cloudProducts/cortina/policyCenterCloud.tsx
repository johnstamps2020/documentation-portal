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
    selectedItemLabel: 'PolicyCenter Cloud',
    items: [
      {
        label: 'PolicyCenter Cloud',
        pagePath: '',
      },
      {
        label: 'BillingCenter Cloud',
        pagePath: 'cloudProducts/cortina/billingCenterCloud',
      },
      {
        label: 'ClaimCenter Cloud',
        pagePath: 'cloudProducts/cortina/claimCenterCloud',
      },
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Core',
      items: [
        {
          label: 'PolicyCenter for Guidewire Cloud',
          pagePath: 'cloudProducts/cortina/policyCenterCloud/pcGwCloud/2021.04',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools330',
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
              pagePath: 'cloudProducts/cortina/dhGwCloud/2021.04',
            },
            {
              label: 'InfoCenter for Guidewire Cloud',
              pagePath: 'cloudProducts/cortina/icGwCloud/2021.04',
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
              pagePath: 'cloudProducts/cortina/ceAccountMgmt/2021.04',
            },
            {
              label: 'CustomerEngage Quote and Buy',
              pagePath:
                'cloudProducts/cortina/policyCenterCloud/ceQuoteAndBuy/2021.04',
            },
            {
              label: 'ProducerEngage',
              pagePath: 'cloudProducts/cortina/producerEngage/2021.04',
            },
            {
              label: 'ServiceRepEngage',
              pagePath:
                'cloudProducts/cortina/policyCenterCloud/serviceRepEngage/2021.04',
            },
          ],
        },
        {
          label: 'Digital Framework',
          items: [
            {
              label: 'Jutro Design System',
              pagePath: 'jutroDesignSystem/5.3.1',
            },
          ],
        },
      ],
    },
  ],
};

export default function PolicyCenterCloud() {
  return <CategoryLayout {...pageConfig} />;
}
