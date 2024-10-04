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
    selectedItemLabel: 'Las Leñas (2024.11)',
    items: allSelectors.testingFrameworkSelector,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'GT: Framework Release and Installation',
      items: [
        {
          label: 'Supported Software Components (Support Matrix)',
          docId: 'testing202411matrix',
        },
        {
          label: 'Release Notes',
          docId: 'testing202411rn',
        },
        {
          label: 'Installation',
          docId: 'testing202411frameworksinstall',
        },
      ],
    },
    {
      label: 'GT: Framework',
      items: [
        {
          label: 'Overview of GT: Framework',
          docId: 'testing202411overview',
        },
        {
          label: 'GT: API Testing',
          docId: 'testing202411api',
        },
        {
          label: 'GT: UI Testing',
          docId: 'testing202411ui',
        },
        {
          label: 'GT: Management',
          docId: 'testing202411mgmt',
        },
        {
          label: 'GT: Load Testing',
          docId: 'testing202411load',
        },
      ],
    },
    {
      label: 'Meeting Cloud Standards for Testing',
      items: [
        {
          label: 'Testing Best Practices',
          docId: 'testing202411testingstandards',
        },
        {
          label: 'Code Coverage',
          docId: 'testing202411codecoverage',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testing202411loadandperf',
        },
      ],
    },
    {
      label: 'InsuranceSuite-specific Capabilities',
      items: [
        {
          label:
            'Configuring InsuranceSuite Apps and Data for Functional Testing',
          docId: 'testing202411istesting',
        },
        {
          label: 'Unit Testing InsuranceSuite with GUnit',
          docId: 'testing202411isunittesting',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/testingFramework/laslenas')({
  component: LasLenas,
});

function LasLenas() {
  return <SectionLayout {...pageConfig} />;
}