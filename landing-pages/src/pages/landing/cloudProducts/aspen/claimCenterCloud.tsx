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
        label: 'ClaimCenter Cloud',
        pagePath: '',
      },
      {
        label: 'BillingCenter Cloud',
        pagePath: 'cloudProducts/aspen/billingCenterCloud',
      },
      {
        label: 'PolicyCenter Cloud',
        pagePath: 'cloudProducts/aspen/policyCenterCloud',
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
          docId: 'cloudcc202005',
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
              docId: 'dh202005',
            },
            {
              label: 'InfoCenter for Guidewire Cloud',
              docId: 'ic202005',
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
              docId: 'dxceam202010',
            },
            {
              label: 'CustomerEngage Account Management for ClaimCenter',
              docId: 'dxceclaims202010',
            },
            {
              label: 'ProducerEngage',
              docId: 'dxpe202010',
            },
            {
              label: 'ProducerEngage for ClaimCenter',
              docId: 'dxpeclaims202010',
            },
            {
              label: 'VendorEngage',
              docId: 'dxve202010',
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
