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
          docId: 'jutroplatformflaine',
        },
      ],
    },
    {
      label: '',
      items: [
        {
          label: 'Jutro Digital Platform (Early Access)',
          docId: 'jutronext',
        },
      ],
    },
    {
      label: '',
      items: [
        {
          label: 'Jutro SDK (Early Access)',
          docId: 'jutrosdkflaine',
        },
      ],
    },
    {
      label: 'Tools and libraries',
      items: [
        {
          label: 'Jutro SDK',
          docId: 'jutrosdknext',
          pathInDoc: 'docs/jutro-sdk-overview',
          videoIcon: false,
        },
        {
          label: 'APD toolkit',
          docId: 'jutrosdknext',
          pathInDoc: 'docs/apd-toolkit-overview',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Jutro Design System 8.3.0',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro830',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook830',
        },
      ],
    },
  ],
};

export const Route = createFileRoute(
  '/cloudProducts/flaine/jutroDigitalPlatform'
)({
  component: JutroDigitalPlatform,
});

function JutroDigitalPlatform() {
  return <CategoryLayout {...pageConfig} />;
}
