import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Jasper (2024.02)',
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
          docId: 'testingframeworksmatrixjasper',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrnjasper',
        },
      ],
    },
    {
      label: 'Overview',
      items: [
        {
          label: 'Overview of GT: Framework',
          docId: 'testing202402overview',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Guidewire Testing Framework Installation',
          docId: 'testingframeworksinstalljasper',
        },
      ],
    },
    {
      label: 'Application-specific Capabilities',
      items: [
        {
          label: 'InsuranceSuite Unit Testing',
          docId: 'is202402testing',
        },
      ],
    },
    {
      label: 'Test Process Capabilities',
      items: [
        {
          label: 'Test Management',
          docId: 'testingframeworksmgmtjasper',
        },
      ],
    },
    {
      label: 'Cross-application Capabilities',
      items: [
        {
          label: 'API Testing',
          docId: 'testingframeworksapijasper',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testingframeworksloadjasper',
        },
        {
          label: 'User Interface Testing',
          docId: 'testingframeworksuijasper',
        },
        {
          label: 'User Interface Accessibility Testing',
          docId: 'is202402access',
        },
      ],
    },
  ],
};

export default function Jasper() {
  return <SectionLayout {...pageConfig} />;
}
