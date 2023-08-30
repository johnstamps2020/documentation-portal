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
    items: allSelectors.s641a38c0db32b1509b9fabce309d960f,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'Guía de administración de contactos de Guidewire',
          url: '/l10n/pdfs/es-LA/cm/2021.11/ContactMgmtGuide-ESLA.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
