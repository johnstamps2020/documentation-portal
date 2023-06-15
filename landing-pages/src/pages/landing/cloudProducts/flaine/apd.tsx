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
          label: 'APD App Release Notes',
          docId: 'apdapprnflaine',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'APD App Guide',
          docId: 'apdappflaine',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'APD API Reference',
          docId: 'apdmaindoc',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'APD for Claims (Early Access)',
          docId: 'apdclaimsflaine',
        },
      ],
    },
  ],
};

export default function Apd() {
  return <SectionLayout {...pageConfig} />;
}
