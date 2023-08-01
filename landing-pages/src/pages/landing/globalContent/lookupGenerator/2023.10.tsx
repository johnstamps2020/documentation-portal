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
          docId: 'gondolaslgrninnsbruck',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'gondolaslgappinnsbruck',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation and Deployment',
          docId: 'gondolaslginstallinnsbruck',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'gondolaslgconfiginnsbruck',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'gondolaslginteginnsbruck',
        },
      ],
    },
  ],
};

export default function LandingPage202310() {
  return <SectionLayout {...pageConfig} />;
}
