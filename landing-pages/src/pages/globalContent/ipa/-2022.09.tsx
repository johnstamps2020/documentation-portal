import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';

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
          docId: 'ipacloudelysianrn',
        },
      ],
    },
    {
      label: 'Developers',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ipacloudelysianconfig',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ipacloudelysianapp',
        },
      ],
    },
  ],
};

export default function LandingPage202209() {
  return <SectionLayout {...pageConfig} />;
}
