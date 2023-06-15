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
