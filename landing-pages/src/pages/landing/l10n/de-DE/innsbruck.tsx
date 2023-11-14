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
    selectedItemLabel: 'Was ist neu in Innsbruck',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '[TBD]What\'s new in Innsbruck',
      items: [
        {
          label: '[TBD]What\'s New in Innsbruck',
          docId: 'whatsnewdeDEinnsbruck',
        },
      ],
    },
  ],
};

export default function LandingPageinnsbruck() {
  return <CategoryLayout {...pageConfig} />;
}

