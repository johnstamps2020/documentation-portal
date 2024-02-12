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
    selectedItemLabel: 'Advanced Product Designer',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: '[TBD]Advanced Product Designer Release Notes',
          docId: 'apdes419apprninnsbruck',
        },
        {
          label: '[TBD]Creating Products with APD App',
          docId: 'apdes419creatingproductsinnsbruck',
        },
        {
          label: '[TBD]Integrating Products with PolicyCenter',
          docId: 'apdes419finalizingproductsinnsbruck',
        },
      ],
    },
  ],
};

export default function Gtest() {
  return <CategoryLayout {...pageConfig} />;
}
