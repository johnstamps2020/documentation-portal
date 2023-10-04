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
    selectedItemLabel: 'Elysian (2022.05)',
    items: allSelectors.testingFramework,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'Release Documentation',
      items: [
        {
          label:
            'Guidewire Testing Framework Supported Software Components (Support Matrix)',
          docId: 'testingframeworksmatrixelysian',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrnelysian',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Guidewire Testing Framework Installation',
          docId: 'testingframeworksinstallelysian',
        },
      ],
    },
    {
      label: 'Application-specific Capabilities',
      items: [
        {
          label: 'InsuranceSuite Unit Testing',
          docId: 'is202205testing',
        },
      ],
    },
    {
      label: 'Test Process Capabilities',
      items: [
        {
          label: 'Test Data Management',
          docId: 'testingframeworksdataelysian',
        },
        {
          label: 'Test Management',
          docId: 'testingframeworksmgmtelysian',
        },
      ],
    },
    {
      label: 'Cross-application Capabilities',
      items: [
        {
          label: 'API Testing',
          docId: 'testingframeworksapielysian',
        },
        {
          label: 'UI Testing',
          docId: 'testingframeworksuielysian',
        },
      ],
    },
  ],
};

export default function Elysian() {
  return <SectionLayout {...pageConfig} />;
}
