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
          docId: 'dxdirelnotes34',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dxdiapp34',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dxdiinstall34',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dxdiadmin34',
        },
      ],
    },
  ],
};

export default function LandingPage34() {
  return <SectionLayout {...pageConfig} />;
}
