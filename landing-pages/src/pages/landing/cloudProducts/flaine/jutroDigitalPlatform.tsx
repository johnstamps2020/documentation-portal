import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  cards: [
    {
      label: 'Jutro Digital Platform (Early Access)',
    },
    {
      label: 'Jutro Digital Platform (Early Access)',
    },
    {
      label: 'Jutro SDK (Early Access)',
    },
    {
      label: 'Tools and libraries',
      items: [
        {
          label: 'Jutro SDK',
          url: '/jutro/sdk/next/docs/jutro-sdk-overview',
          videoIcon: false,
        },
        {
          label: 'APD toolkit',
          url: '/jutro/sdk/next/docs/apd-overview',
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

export default function JutroDigitalPlatform() {
  return <CategoryLayout {...pageConfig} />;
}
