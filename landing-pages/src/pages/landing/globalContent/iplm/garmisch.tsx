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
          docId: 'londonrngarmisch',
        },
      ],
    },
    {
      label: 'Developers',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'londonconfiggarmisch',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccappgarmisch',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcappgarmisch',
        },
      ],
    },
  ],
};

export default function Garmisch() {
  return <SectionLayout {...pageConfig} />;
}
