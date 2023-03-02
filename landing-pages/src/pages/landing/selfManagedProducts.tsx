import CategoryLayout, {
  CategoryLayoutProps,
} from '../../components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from '../LandingPage/LandingPage';

const docs: CategoryLayoutProps['cards'] = [
  {
    label: 'Core',
    items: [
      {
        label: "What's New for Self-Managed Implementations",
        url:
          'https://www.brainshark.com/1/player/guidewire?pi=zGSzK26rDzeZ1oz0&r3f1=&fb=0',
      },
      {
        label: 'PolicyCenter',
        pagePath: 'selfManagedProducts/pc/10.2.2',
      },
      {
        label: 'ClaimCenter',
        pagePath: 'selfManagedProducts/cc/10.2.2',
      },
      {
        label: 'BillingCenter',
        pagePath: 'selfManagedProducts/bc/10.2.2',
      },
      {
        label: 'InsuranceSuite Configuration Upgrade Tools',
        docId: 'isconfigupgradetools450',
      },
      {
        label: 'InsuranceSuite Configuration Upgrade Tools Compatibility',
        docId: 'isupgradecompatibility',
      },
      {
        label: 'REST API Client',
        docId: 'isrestapiclientguide',
      },
      {
        label: 'Guidewire for Salesforce',
        pagePath: 'selfManagedProducts/gwsf/di/3.4',
      },
    ],
    sections: [
      {
        label: 'Global Content',
        items: [
          {
            label: 'France',
            pagePath: 'globalContent/ipf/2.0',
          },
          {
            label: 'Germany',
            pagePath: 'globalContent/ipg/latest',
          },
          {
            label: 'Japan (0.1)',
            pagePath: 'globalContent/ipj/0.1',
          },
          {
            label: 'Japan (1.0)',
            pagePath: 'globalContent/ipj/1.0',
          },
        ],
      },
    ],
  },
  {
    label: 'Analytics',
    items: [
      {
        label: 'DataHub',
        pagePath: 'selfManagedProducts/dh/10.8.0',
      },
      {
        label: 'InfoCenter',
        pagePath: 'selfManagedProducts/ic/10.8.0',
      },
      {
        label: 'DataHub',
        pagePath: 'selfManagedProducts/dh/10.9.0',
      },
      {
        label: 'InfoCenter',
        pagePath: 'selfManagedProducts/ic/10.9.0',
      },
    ],
  },
  {
    label: 'Digital',
    items: [
      {
        label: 'CustomerEngage Account Management',
        pagePath: 'selfManagedProducts/ceAccountMgmt/11.5.0',
      },
      {
        label: 'CustomerEngage Account Management for ClaimCenter',
        pagePath: 'selfManagedProducts/ceAccountMgmtCc/11.5.0',
      },
      {
        label: 'CustomerEngage Quote and Buy',
        pagePath: 'selfManagedProducts/ceQuoteAndBuy/11.5.0',
      },
      {
        label: 'Jutro Design System',
        pagePath: 'jutroDesignSystem/8.6.1',
      },
      {
        label: 'ProducerEngage',
        pagePath: 'selfManagedProducts/producerEngage/11.5.0',
      },
      {
        label: 'ProducerEngage for ClaimCenter',
        pagePath: 'selfManagedProducts/producerEngageCc/11.5.0',
      },
      {
        label: 'ServiceRepEngage',
        pagePath: 'selfManagedProducts/serviceRepEngage/11.5.0',
      },
      {
        label: 'VendorEngage',
        pagePath: 'vendorEngage/11.5.0',
      },
    ],
  },
];

const backgroundProps: CategoryLayoutProps['backgroundProps'] = {
  ...baseBackgroundProps,
  backgroundColor: 'white',
};

export default function Elysian() {
  return (
    <CategoryLayout
      cards={docs}
      backgroundProps={backgroundProps}
      showReleaseSelector={false}
      selfManaged={true}
    />
  );
}
