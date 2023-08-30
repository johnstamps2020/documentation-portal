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
    selectedItemLabel: 'InsuranceSuite Contact Management',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/pdfs/es-ES/cm/2022.05/ContactMgmtGuide_es-ES.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
