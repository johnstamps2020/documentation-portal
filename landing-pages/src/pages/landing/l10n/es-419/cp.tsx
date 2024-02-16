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
      label: 'Notas de la version',
      items: [
        {
          label: 'Notas de la version de la Plataforma de Guidewire Cloud',
          docId: 'gwcpes419releasenotes',
        },
      ],
    },
  ],
};

export default function Cp() {
  return <CategoryLayout {...pageConfig} />;
}
