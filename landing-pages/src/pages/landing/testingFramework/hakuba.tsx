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
          docId: 'testingframeworksmatrixhakuba',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrnhakuba',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Guidewire Testing Framework Installation',
          docId: 'testingframeworksinstallhakuba',
        },
      ],
    },
    {
      label: 'Application-specific Capabilities',
      items: [
        {
          label: 'InsuranceSuite Unit Testing',
          docId: 'is202306testing',
        },
      ],
    },
    {
      label: 'Test Process Capabilities',
      items: [
        {
          label: 'Test Management',
          docId: 'testingframeworksmgmthakuba',
        },
      ],
    },
    {
      label: 'Cross-application Capabilities',
      items: [
        {
          label: 'API Testing',
          docId: 'testingframeworksapihakuba',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testingframeworksloadhakuba',
        },
        {
          label: 'User Interface Testing',
          docId: 'testingframeworksuihakuba',
        },
        {
          label: 'User Interface Accessibility Testing',
          docId: 'is202306access',
        },
      ],
    },
  ],
};

export default function Hakuba() {
  return <SectionLayout {...pageConfig} />;
}