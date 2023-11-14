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
    selectedItemLabel: '[TBD]What\s new in Innsbruck',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
{
label: '[TBD]What\'s new in Innsbruck', 
items: [
{
label: '[TBD]What\'s New in Innsbruck', 
docId: 'whatsnewfrFRinnsbruck', 
}, 
],
},
  ],
};

export default function LandingPageinnsbruck() {
  return <CategoryLayout {...pageConfig} />;
}

