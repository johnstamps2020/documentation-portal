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
        pagePath: 'cloudProducts/aspen/policyCenterCloud',
      },
      {
        label: 'BillingCenter Cloud',
        pagePath: 'cloudProducts/aspen/billingCenterCloud',
      },
      {
        label: 'ClaimCenter Cloud',
        pagePath: 'cloudProducts/aspen/claimCenterCloud',
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
          docId: 'cloudpc202005',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools310',
        },
      ],
      sections: [
        {
          label: 'Lines of business',
          items: [
            {
              label: 'Businessowners Standards Based Template',
              pagePath:
                'cloudProducts/aspen/policyCenterCloud/boStandardsBasedTemplate/2020.05',
            },
            {
              label: 'Commercial Auto Standards Based Template',
              pagePath:
                'cloudProducts/aspen/policyCenterCloud/caStandardsBasedTemplate/2020.05',
            },
            {
              label: 'Crime Standards Based Template',
              pagePath:
                'cloudProducts/aspen/policyCenterCloud/crimeStandardsBasedTemplate/2020.05',
            },
            {
              label: 'General Liability Standards Based Template',
              pagePath:
                'cloudProducts/aspen/policyCenterCloud/glStandardsBasedTemplate/2020.05',
            },
          ],
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
              label: 'CustomerEngage Quote and Buy',
              docId: 'dxceqb202010',
            },
            {
              label: 'ProducerEngage',
              docId: 'dxpe202010',
            },
            {
              label: 'ServiceRepEngage',
              docId: 'dxsre202010',
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

export default function PolicyCenterCloud() {
  return <CategoryLayout {...pageConfig} />;
}
