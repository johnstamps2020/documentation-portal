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

export const Route = createFileRoute('/l10n/es-419/cp')({
  component: Cp,
});

function Cp() {
  return <CategoryLayout {...pageConfig} />;
}
