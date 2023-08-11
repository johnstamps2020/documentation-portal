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
    selectedItemLabel: 'ClaimCenter Cloud',
    items: allSelectors.sb1572a4ac17ba705fdfb0f9ebe00d8e1,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Core',
      items: [
        {
          label: 'ClaimCenter for Guidewire Cloud',
          pagePath: 'cloudProducts/cortina/claimCenterCloud/ccGwCloud/2021.04',
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
              label: 'CustomerEngage Account Management for ClaimCenter',
              pagePath:
                'cloudProducts/cortina/claimCenterCloud/ceAccountMgmtCc/2021.04',
            },
            {
              label: 'ProducerEngage',
              pagePath: 'cloudProducts/cortina/producerEngage/2021.04',
            },
            {
              label: 'ProducerEngage for ClaimCenter',
              pagePath:
                'cloudProducts/cortina/claimCenterCloud/producerEngageCc/2021.04',
            },
            {
              label: 'VendorEngage',
              pagePath:
                'cloudProducts/cortina/claimCenterCloud/vendorEngage/2021.04',
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

export default function ClaimCenterCloud() {
  return <CategoryLayout {...pageConfig} />;
}
