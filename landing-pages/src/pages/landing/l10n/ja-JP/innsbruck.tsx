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
    label: '製品を選択',
    selectedItemLabel: 'Innsbruck の新機能',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
{
label: '[TBD]What\'s new in Innsbruck', 
items: [
{
label: '[TBD]What\'s New in Innsbruck', 
docId: 'whatsnewjaJPinnsbruck', 
}, 
],
},
  ],
};

export default function LandingPageinnsbruck() {
  return <CategoryLayout {...pageConfig} />;
}

