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
          docId: 'dxedrelnotes330',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dxedapp330',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dxedinstall330',
        },
      ],
    },
  ],
};

export default function LandingPage330() {
  return <SectionLayout {...pageConfig} />;
}
