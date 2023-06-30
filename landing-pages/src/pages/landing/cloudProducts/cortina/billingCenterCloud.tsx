import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Select page',
    selectedItemLabel: 'BillingCenter Cloud',
    items: [
      {
        label: 'BillingCenter Cloud',
        pagePath: 'cloudProducts/cortina/billingCenterCloud',
      },
      {
        label: 'ClaimCenter Cloud',
        pagePath: 'cloudProducts/cortina/claimCenterCloud',
      },
      {
        label: 'PolicyCenter Cloud',
        pagePath: 'cloudProducts/cortina/policyCenterCloud',
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
          pagePath:
            'cloudProducts/cortina/billingCenterCloud/bcGwCloud/2021.04',
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
          label: 'Data Platform',
          pagePath: 'cloudProducts/dataPlatform',
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
      label: 'Digital Framework',
      items: [
        {
          label: 'Jutro Design System',
          pagePath: 'jutroDesignSystem/5.3.1',
        },
      ],
    },
  ],
};

export default function BillingCenterCloud() {
  return <CategoryLayout {...pageConfig} />;
}
