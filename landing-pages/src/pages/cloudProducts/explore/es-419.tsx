import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

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

export const Route = createFileRoute('/cloudProducts/explore/es-419')({
  component: Es419,
});

function Es419() {
  return <SectionLayout {...pageConfig} />;
}
