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
      label: 'Release Notes',
      items: [
        {
          label: 'Guidewire Cloud Platform Release Notes',
          docId: 'gwcpreleasenotes',
        },
      ],
    },
    {
      label: 'Getting Started',
      items: [
        {
          label: 'Network Connectivity',
          docId: 'cloudplatformrelease',
        },
      ],
    },
    {
      label: 'Authentication',
      items: [
        {
          label: 'Authentication',
          docId: 'guidewireidentityfederationhub',
        },
      ],
    },
    {
      label: 'Guidewire Cloud Console',
      items: [
        {
          label: 'Cloud Console Guide',
          docId: 'guidewirecloudconsolerootinsurerdev',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/guidewireCloudPlatform')({
  component: GuidewireCloudPlatform,
});

function GuidewireCloudPlatform() {
  return <SectionLayout {...pageConfig} />;
}
