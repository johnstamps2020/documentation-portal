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
    label: 'Seleccionar producto',
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Novedades de Hakuba',
      items: [
        {
          label: 'Novedades de Hakuba',
          docId: 'whatsnewes419hakuba',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function LandingPage202306hakubawhatsnew() {
  return <CategoryLayout {...pageConfig} />;
}
