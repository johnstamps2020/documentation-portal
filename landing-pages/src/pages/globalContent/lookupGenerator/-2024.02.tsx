import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';

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
          docId: 'gondolaslgrnjasper',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'gondolaslgappjasper',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation and Deployment',
          docId: 'gondolaslginstalljasper',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'gondolaslgconfigjasper',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'gondolaslgintegjasper',
        },
      ],
    },
  ],
};

export default function LandingPage202402() {
  return <SectionLayout {...pageConfig} />;
}
