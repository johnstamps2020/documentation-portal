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
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Notas de versão',
      items: [
        {
          label: 'Notas de versão da Cloud Platform',
          docId: 'gwcpptBRreleasenotes',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/cp')({
  component: Cp,
});

function Cp() {
  return <CategoryLayout {...pageConfig} />;
}
