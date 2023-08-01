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
          label: 'Guía de la aplicación',
          url: '/l10n/es-LA/explore/2021.11/es-LA-CloudExplore.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Explore() {
  return <CategoryLayout {...pageConfig} />;
}
