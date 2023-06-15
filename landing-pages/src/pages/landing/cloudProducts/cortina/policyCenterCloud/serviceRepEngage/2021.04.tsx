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
          docId: 'dx202104srerelnotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dx202104sreinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx202104sreapp',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx202104sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202104srerefguides',
        },
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202104',
        },
      ],
    },
  ],
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
