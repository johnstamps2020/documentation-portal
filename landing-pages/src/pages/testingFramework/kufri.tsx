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
    selectedItemLabel: 'Kufri (2024.07)',
    items: allSelectors.testingFrameworkSelector,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'GT: Framework Release and Installation',
      items: [
        {
          label: 'Supported Software Components (Support Matrix)',
          docId: 'testing202407matrix',
        },
        {
          label: 'Release Notes',
          docId: 'testing202407rn',
        },
        {
          label: 'Installation',
          docId: 'testing202407frameworksinstall',
        },
      ],
    },
    {
      label: 'GT: Framework',
      items: [
        {
          label: 'Overview of GT: Framework',
          docId: 'testing202407overview',
        },
        {
          label: 'GT: API Testing',
          docId: 'testing202407api',
        },
        {
          label: 'GT: UI Testing',
          docId: 'testing202407ui',
        },
        {
          label: 'GT: Management',
          docId: 'testing202407mgmt',
        },
        {
          label: 'GT: Load Testing',
          docId: 'testing202407load',
        },
      ],
    },
    {
      label: 'Meeting Cloud Standards for Testing',
      items: [
        {
          label: 'Testing Best Practices',
          docId: 'testing202407testingstandards',
        },
        {
          label: 'Code Coverage',
          docId: 'testing202407codecoverage',
        },
        {
          label: 'Load and Performance Testing',
          docId: 'testing202407loadandperf',
        },
      ],
    },
    {
      label: 'InsuranceSuite-specific Capabilities',
      items: [
        {
          label:
            'Configuring InsuranceSuite Apps and Data for Functional Testing',
          docId: 'testing202407istesting',
        },
        {
          label: 'Unit Testing InsuranceSuite with GUnit',
          docId: 'testing202407isunittesting',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/testingFramework/kufri')({
  component: Kufri,
});

function Kufri() {
  return <SectionLayout {...pageConfig} />;
}
