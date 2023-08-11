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
    selectedItemLabel: 'PolicyCenter Cloud',
    items: allSelectors.s516deedcbe9a11db4e386860485ea15e,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Core',
      items: [
        {
          label: 'PolicyCenter for Guidewire Cloud',
          pagePath: 'cloudProducts/banff/policyCenterCloud/pcGwCloud/2020.11',
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
                'cloudProducts/banff/policyCenterCloud/boStandardsBasedTemplate/2020.11',
            },
            {
              label: 'Commercial Auto Standards Based Template',
              pagePath:
                'cloudProducts/banff/policyCenterCloud/caStandardsBasedTemplate/2020.11',
            },
            {
              label: 'Crime Standards Based Template',
              pagePath:
                'cloudProducts/banff/policyCenterCloud/crimeStandardsBasedTemplate/2020.11',
            },
            {
              label: 'General Liability Standards Based Template',
              pagePath:
                'cloudProducts/banff/policyCenterCloud/glStandardsBasedTemplate/2020.11',
            },
            {
              label: 'Workers Compensation Standards Based Template',
              pagePath:
                'cloudProducts/banff/policyCenterCloud/wcStandardsBasedTemplate/2020.11',
            },
          ],
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
              label: 'CustomerEngage Quote and Buy',
              docId: 'dxceqb202011',
            },
            {
              label: 'ProducerEngage',
              docId: 'dxpe202011',
            },
            {
              label: 'ServiceRepEngage',
              docId: 'dxsre202011',
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
        {
          label: 'Add-ons',
          items: [
            {
              label: 'Digital Code Generation Extension Pack',
              docId: 'dxapd202011',
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
