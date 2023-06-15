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
