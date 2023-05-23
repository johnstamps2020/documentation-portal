import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202104perelnotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dx202104peinstall',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202104dcg',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx202104peapp',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx202104pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202104perefguides',
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