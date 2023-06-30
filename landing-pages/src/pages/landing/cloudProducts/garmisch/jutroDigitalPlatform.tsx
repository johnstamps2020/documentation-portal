import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

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
          url: '/jutro/sdk/garmisch/docs/jutro-sdk-overview',
          videoIcon: false,
        },
        {
          label: 'APD toolkit (Early Access)',
          url: '/jutro/sdk/garmisch/docs/apd-toolkit-overview',
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

export default function JutroDigitalPlatform() {
  return <CategoryLayout {...pageConfig} />;
}
