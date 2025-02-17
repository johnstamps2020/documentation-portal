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
    selectedItemLabel: 'Flaine (2022.09)',
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
          docId: 'testingframeworksmatrixflaine',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrnflaine',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Guidewire Testing Framework Installation',
          docId: 'testingframeworksinstallflaine',
        },
      ],
    },
    {
      label: 'Application-specific Capabilities',
      items: [
        {
          label: 'InsuranceSuite Unit Testing',
          docId: 'is202209testing',
        },
      ],
    },
    {
      label: 'Test Process Capabilities',
      items: [
        {
          label: 'Test Management',
          docId: 'testingframeworksmgmtflaine',
        },
      ],
    },
    {
      label: 'Cross-application Capabilities',
      items: [
        {
          label: 'API Testing',
          docId: 'testingframeworksapiflaine',
        },
        {
          label: 'Load and Performance Testing (Early Access)',
          docId: 'testingframeworksloadflaine',
        },
        {
          label: 'User Interface Testing',
          docId: 'testingframeworksuiflaine',
        },
        {
          label: 'User Interface Accessibility Testing (Early Access)',
          docId: 'is202209access',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/testingFramework/flaine')({
  component: Flaine,
});

function Flaine() {
  return <SectionLayout {...pageConfig} />;
}
