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
