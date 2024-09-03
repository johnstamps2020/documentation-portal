import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '',
      items: [
        {
          label: 'Consola de Guidewire Cloud',
          docId: 'guidewirecloudconsolerootinsurerdeves419',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-419/gcc')({
  component: Gcc,
});

function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}
