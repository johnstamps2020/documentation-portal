import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Seleccionar producto',
    selectedItemLabel: 'InsuranceSuite Contact Management',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'Guía de administración de contactos de Guidewire',
          docId: 'is202111contactes419',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-419/cm')({
  component: Cm,
});

function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
