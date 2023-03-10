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
