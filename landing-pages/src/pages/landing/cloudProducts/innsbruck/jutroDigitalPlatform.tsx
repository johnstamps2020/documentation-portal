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
          docId: 'jutroplatformnext',
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
          url: '/jutro/sdk/next/docs/jutro-sdk-overview',
          videoIcon: false,
        },
        {
          label: 'APD toolkit (Early Access)',
          url: '/jutro/sdk/next/docs/apd-toolkit-overview',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Jutro Design System (Next)',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutronext',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybooknext',
        },
      ],
    },
  ],
};

export default function JutroDigitalPlatform() {
  return <CategoryLayout {...pageConfig} />;
}
