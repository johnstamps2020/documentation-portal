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
          docId: 'dxedrelnotes331',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dxedapp331',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dxedinstall331',
        },
      ],
    },
  ],
};

export default function LandingPage331() {
  return <SectionLayout {...pageConfig} />;
}
