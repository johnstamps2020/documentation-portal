import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
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
