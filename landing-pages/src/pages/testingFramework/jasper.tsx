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
    selectedItemLabel: 'Jasper (2024.02)',
    items: allSelectors.testingFrameworkSelector,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'GT: Framework Release and Installation',
      items: [
        {
          label: 'Supported Software Components (Support Matrix)',
          docId: 'testing202402matrix',
        },
        {
          label: 'Release Notes',
          docId: 'testing202402rn',
        },
        {
          label: 'Installation',
          docId: 'testing202402frameworksinstall',
        },
      ],
    },
    {
      label: 'GT: Framework',
      items: [
        {
          label: 'Overview of GT: Framework',
          docId: 'testing202402overview',
        },
        {
          label: 'GT: API Testing',
          docId: 'testing202402api',
        },
        {
          label: 'GT: UI Testing',
          docId: 'testing202402ui',
        },
        {
          label: 'GT: Management',
          docId: 'testing202402mgmt',
        },
        {
          label: 'GT: Load Testing',
          docId: 'testing202402load',
        },
      ],
    },
    {
      label: 'Meeting Cloud Standards for Testing',
      items: [
        {
          label: 'Testing Best Practices',
          docId: 'testing202402testingstandards',
        },
        {
          label: 'Code Coverage',
          docId: 'testing202402codecoverage',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testing202402loadandperf',
        },
      ],
    },
    {
      label: 'InsuranceSuite-specific Capabilities',
      items: [
        {
          label:
            'Configuring InsuranceSuite Apps and Data for Functional Testing',
          docId: 'testing202402istesting',
        },
        {
          label: 'Unit Testing InsuranceSuite with GUnit',
          docId: 'testing202402isunittesting',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/testingFramework/jasper')({
  component: Jasper,
});

function Jasper() {
  return <SectionLayout {...pageConfig} />;
}
