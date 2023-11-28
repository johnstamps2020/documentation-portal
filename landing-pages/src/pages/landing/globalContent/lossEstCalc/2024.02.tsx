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
          docId: 'gondolaslecrnjasper',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'gondolaslecappjasper',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation and Deployment',
          docId: 'gondolaslecinstalljasper',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'gondolaslecconfigjasper',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'gondolaslecintegjasper',
        },
      ],
    },
  ],
};

export default function LandingPage202402() {
  return <SectionLayout {...pageConfig} />;
}
