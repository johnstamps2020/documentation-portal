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
          docId: 'londonrnhakuba',
        },
      ],
    },
    {
      label: 'Developers',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'londonconfighakuba',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccapphakuba',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcapphakuba',
        },
      ],
    },
  ],
};

export default function Hakuba() {
  return <SectionLayout {...pageConfig} />;
}
