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
    selectedItemLabel: 'BillingCenter Cloud',
    items: [
      {
        label: 'BillingCenter Cloud',
        pagePath: '',
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
          label: 'BillingCenter for Guidewire Cloud',
          pagePath: 'cloudProducts/banff/billingCenterCloud/bcGwCloud/2020.11',
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
          label: 'Explore',
          pagePath: 'cloudProducts/explore/latest',
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
      label: 'Digital Framework',
      items: [
        {
          label: 'Jutro Design System',
          pagePath: 'jutroDesignSystem/4.1.1',
        },
      ],
    },
  ],
};

export default function BillingCenterCloud() {
  return <CategoryLayout {...pageConfig} />;
}
