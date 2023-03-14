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
      label: 'Best Practices',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro861',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Jutro Storybook',
          docId: 'storybook861',
        },
      ],
    },
  ],
};

export default function LandingPage861() {
  return <SectionLayout {...pageConfig} />;
}
