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
          label: 'Release Notes',
          docId: 'londonrngarmisch',
        },
      ],
    },
    {
      label: 'Developers',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'londonconfiggarmisch',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccappgarmisch',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcappgarmisch',
        },
      ],
    },
  ],
};

export default function Garmisch() {
  return <SectionLayout {...pageConfig} />;
}
