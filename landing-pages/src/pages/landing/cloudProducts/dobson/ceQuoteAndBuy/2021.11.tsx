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
          docId: 'dx202111ceqbrelnotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dx202111ceqbinstall',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202111dcg',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx202111ceqbapp',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx202111ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202111ceqbrefguides',
        },
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202111',
        },
      ],
    },
  ],
};

export default function LandingPage202111() {
  return <SectionLayout {...pageConfig} />;
}
