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
label: 'Innsbruck の新機能', 
items: [
{
label: 'Innsbruck の新機能', 
docId: 'whatsnewjaJPinnsbruck', 
}, 
],
},
  ],
};

export default function LandingPageinnsbruck() {
  return <CategoryLayout {...pageConfig} />;
}

