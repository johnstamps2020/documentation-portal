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
      label: 'Jutro Digital Platform (Early Access)',
      items: [
        {
          label: 'Jutro Web Apps',
          docId: 'jutroplatformhakuba',
        },
        {
          label: 'Templates',
          docId: 'agentquoteandbuypersonalauto',
        },
      ],
    },
    {
      label: 'Tools and libraries',
      items: [
        {
          label: 'Jutro SDK (Early Access)',
          docId: 'jutrosdkhakuba',
          pathInDoc: 'docs/jutro-sdk-overview',
          videoIcon: false,
        },
        {
          label: 'APD toolkit (Early Access)',
          docId: 'jutrosdkhakuba',
          pathInDoc: 'docs/apd-toolkit-overview',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Jutro Design System 8.10.0',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro8100',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook8100',
        },
      ],
    },
  ],
};

export default function JutroDigitalPlatform() {
  return <CategoryLayout {...pageConfig} />;
}
