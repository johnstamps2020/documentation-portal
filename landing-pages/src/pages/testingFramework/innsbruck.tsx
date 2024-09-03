import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.testingFrameworkSelector,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'Release Documentation',
      items: [
        {
          label:
            'Guidewire Testing Framework Supported Software Components (Support Matrix)',
          docId: 'testingframeworksmatrixinnsbruck',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrninnsbruck',
        },
      ],
    },
    {
      label: 'Overview',
      items: [
        {
          label: 'Overview of GT: Framework',
          docId: 'testing202310overview',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Guidewire Testing Framework Installation',
          docId: 'testingframeworksinstallinnsbruck',
        },
      ],
    },
    {
      label: 'Application-specific Capabilities',
      items: [
        {
          label: 'InsuranceSuite Unit Testing',
          docId: 'is202310testing',
        },
      ],
    },
    {
      label: 'Test Process Capabilities',
      items: [
        {
          label: 'Test Management',
          docId: 'testingframeworksmgmtinnsbruck',
        },
      ],
    },
    {
      label: 'Cross-application Capabilities',
      items: [
        {
          label: 'API Testing',
          docId: 'testingframeworksapiinnsbruck',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testingframeworksloadinnsbruck',
        },
        {
          label: 'User Interface Testing',
          docId: 'testingframeworksuiinnsbruck',
        },
        {
          label: 'User Interface Accessibility Testing',
          docId: 'is202310access',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/testingFramework/innsbruck')({
  component: Innsbruck,
});

function Innsbruck() {
  return <SectionLayout {...pageConfig} />;
}
