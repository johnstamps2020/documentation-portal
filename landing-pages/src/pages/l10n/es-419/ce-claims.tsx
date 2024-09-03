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
    selectedItemLabel: 'CustomerEngage Account Management for ClaimCenter',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de la versión',
          docId: 'dx202306es419ceclaimsrelnotes',
        },
      ],
    },
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'dx202205es419ceclaimsapp',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-419/ce-claims')({
  component: Ceclaims,
});

function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
