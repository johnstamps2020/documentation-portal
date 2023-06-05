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
      label: '10.0.2',
      items: [
        {
          label: 'Guidewire Contact Management Guide',
          url: '/l10n/nl-NL/cc/10.0.2/nl-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
