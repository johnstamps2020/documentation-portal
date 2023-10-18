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
    label: 'Selecione o produto',
    selectedItemLabel: 'Novidades na Hakuba',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Novidades na Hakuba',
      items: [
        {
          label: 'Novidades na Hakuba',
          docId: 'whatsnewptBRhakuba',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function LandingPage202306hakubawhatsnew() {
  return <CategoryLayout {...pageConfig} />;
}
