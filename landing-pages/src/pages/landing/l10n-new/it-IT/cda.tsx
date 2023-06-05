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
      label: '2021.11',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/cda/2021.11/IT-CloudDataAccess.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cda() {
  return <CategoryLayout {...pageConfig} />;
}
