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
      label: 'Best Practices',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro832',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Jutro Storybook',
          docId: 'storybook832',
        },
      ],
    },
  ],
};

export default function LandingPage830() {
  return <SectionLayout {...pageConfig} />;
}
