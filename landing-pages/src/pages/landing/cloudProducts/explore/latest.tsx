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
          docId: 'explorernrelease',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'exploreusingrelease',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Data Dictionaries',
          docId: 'exploredatadictrelease',
        },
      ],
    },
  ],
};

export default function Latest() {
  return <SectionLayout {...pageConfig} />;
}
