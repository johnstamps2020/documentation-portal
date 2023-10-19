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
    label: 'Produkt auswählen',
    selectedItemLabel: 'Was ist neu in Hakuba',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Was ist neu in Hakuba',
      items: [
        {
          label: 'Was ist neu in Hakuba',
          docId: 'whatsnewdeDEhakuba',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function LandingPage202306hakubawhatsnew() {
  return <CategoryLayout {...pageConfig} />;
}
