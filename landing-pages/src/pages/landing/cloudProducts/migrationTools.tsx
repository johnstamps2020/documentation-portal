import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  sections: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Billing Migration Tool',
          docId: 'billingmigrationtool',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Policy History Migration Tool',
          docId: 'policyhistorymigrationtool',
        },
      ],
    },
  ],
};

export default function MigrationTools() {
  return <SectionLayout {...pageConfig} />;
}
