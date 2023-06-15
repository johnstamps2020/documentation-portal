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
          docId: 'dx202205perelnotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dx202205peinstall',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202205dcg',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx202205peapp',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx202205pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202205perefguides',
        },
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202205',
        },
      ],
    },
  ],
};

export default function LandingPage202205() {
  return <SectionLayout {...pageConfig} />;
}
