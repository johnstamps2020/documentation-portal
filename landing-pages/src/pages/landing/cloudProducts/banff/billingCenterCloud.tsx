import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Select page',
    selectedItemLabel: 'BillingCenter Cloud',
    items: allSelectors.s516deedcbe9a11db4e386860485ea15e,
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
