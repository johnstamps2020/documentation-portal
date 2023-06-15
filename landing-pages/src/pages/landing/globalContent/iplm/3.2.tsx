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
          docId: 'londonrn32',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcapp32',
        },
      ],
    },
  ],
};

export default function LandingPage32() {
  return <SectionLayout {...pageConfig} />;
}
