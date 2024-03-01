import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: 'hsl(0, 0%, 98%)',
  },

  description: (
    <Box padding="1rem 1rem 0rem 1rem">
      <Typography variant="body1" lineHeight={2}>
        Find documentation for the latest releases of Guidewire self-managed
        products.
      </Typography>
      <Typography variant="body1" lineHeight={2}>
        Access earlier releases by clicking a product and then selecting a
        version from the <b>Select release</b> dropdown menu.
      </Typography>
    </Box>
  ),
  cards: [
    {
      label: 'Core',
      items: [
        {
          label: 'PolicyCenter',
          pagePath: 'selfManagedProducts/pc/10.2.3',
        },
        {
          label: 'ClaimCenter',
          pagePath: 'selfManagedProducts/cc/10.2.3',
        },
        {
          label: 'BillingCenter',
          pagePath: 'selfManagedProducts/bc/10.2.3',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools510',
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
              pagePath: 'globalContent/ipg/3.8',
            },
            {
              label: 'Germany 3.9',
              pagePath: 'globalContent/ipg/3.9',
            },
            {
              label: 'Japan (0.1)',
              pagePath: 'globalContent/ipj/flaine',
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
          pagePath: 'selfManagedProducts/dh/10.11.0',
        },
        {
          label: 'InfoCenter',
          pagePath: 'selfManagedProducts/ic/10.11.0',
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
          pagePath: 'selfManagedProducts/vendorEngage/11.5.0',
        },
      ],
    },
  ],
  isRelease: false,
};

export default function SelfManagedProducts() {
  return <CategoryLayout {...pageConfig} />;
}
