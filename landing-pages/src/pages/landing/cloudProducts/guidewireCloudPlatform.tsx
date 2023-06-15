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
          docId: 'guidewirecloudconsoleguideinsurerdev',
        },
      ],
    },
  ],
};

export default function GuidewireCloudPlatform() {
  return <SectionLayout {...pageConfig} />;
}
