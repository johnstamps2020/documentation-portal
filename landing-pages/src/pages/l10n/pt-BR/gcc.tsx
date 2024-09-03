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
    label: 'Selecione o produto',
    selectedItemLabel: 'Guidewire Cloud Console',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '',
      items: [
        {
          label: 'Guidewire Cloud Console',
          docId: 'guidewirecloudconsolerootinsurerdevptBR',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/gcc')({
  component: Gcc,
});

function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}
