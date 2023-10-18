import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Choisissez un produit',
    selectedItemLabel: 'CustomerEngage Account Management',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Nouveautés de Hakuba',
      items: [
        {
          label: 'Nouveautés de Hakuba',
          docId: 'whatsnewfrFRhakuba',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function LandingPage202306hakubawhatsnew() {
  return <CategoryLayout {...pageConfig} />;
}
