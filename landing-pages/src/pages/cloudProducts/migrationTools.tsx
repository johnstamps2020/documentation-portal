import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

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

export const Route = createFileRoute('/cloudProducts/migrationTools')({
  component: MigrationTools,
});

function MigrationTools() {
  return <SectionLayout {...pageConfig} />;
}
