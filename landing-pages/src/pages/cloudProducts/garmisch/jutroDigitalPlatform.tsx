import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '',
      items: [
        {
          label: 'Jutro Digital Platform (Early Access)',
          docId: 'jutroplatformgarmisch',
        },
      ],
    },
    {
      label: 'Tools and libraries',
      items: [
        {
          label: 'Jutro SDK (Early Access)',
          docId: 'jutrosdkgarmisch',
          pathInDoc: 'docs/jutro-sdk-overview',
          videoIcon: false,
        },
        {
          label: 'APD toolkit (Early Access)',
          docId: 'jutrosdkgarmisch',
          pathInDoc: 'docs/apd-toolkit-overview',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Jutro Design System 8.6.1',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro861',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook861',
        },
      ],
    },
  ],
};

export const Route = createFileRoute(
  '/cloudProducts/garmisch/jutroDigitalPlatform'
)({
  component: JutroDigitalPlatform,
});

function JutroDigitalPlatform() {
  return <CategoryLayout {...pageConfig} />;
}
