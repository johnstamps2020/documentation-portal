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
      label: 'Best Practices',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro532',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Jutro Storybook',
          docId: 'storybook532',
        },
      ],
    },
  ],
};

export default function LandingPage531() {
  return <SectionLayout {...pageConfig} />;
}
