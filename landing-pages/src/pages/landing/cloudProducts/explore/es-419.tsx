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
          docId: 'explorees419rnrelease',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'explorees419usingrelease',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Data Dictionaries',
          docId: 'explorees419datadictrelease',
        },
      ],
    },
  ],
};

export default function Es419() {
  return <SectionLayout {...pageConfig} />;
}