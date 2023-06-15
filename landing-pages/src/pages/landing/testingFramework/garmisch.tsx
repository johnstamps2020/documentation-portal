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
      label: 'Release Documentation',
      items: [
        {
          label:
            'Guidewire Testing Framework Supported Software Components (Support Matrix)',
          docId: 'testingframeworksmatrixgarmisch',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrngarmisch',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Guidewire Testing Framework Installation',
          docId: 'testingframeworksinstallgarmisch',
        },
      ],
    },
    {
      label: 'Application-specific Capabilities',
      items: [
        {
          label: 'InsuranceSuite Unit Testing',
          docId: 'is202302testing',
        },
      ],
    },
    {
      label: 'Test Process Capabilities',
      items: [
        {
          label: 'Test Management',
          docId: 'testingframeworksmgmtgarmisch',
        },
      ],
    },
    {
      label: 'Cross-application Capabilities',
      items: [
        {
          label: 'API Testing',
          docId: 'testingframeworksapigarmisch',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testingframeworksloadgarmisch',
        },
        {
          label: 'User Interface Testing',
          docId: 'testingframeworksuigarmisch',
        },
        {
          label: 'User Interface Accessibility Testing',
          docId: 'is202302access',
        },
      ],
    },
  ],
};

export default function Garmisch() {
  return <SectionLayout {...pageConfig} />;
}
