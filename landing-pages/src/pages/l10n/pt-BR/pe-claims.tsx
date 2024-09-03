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
    selectedItemLabel: 'ProducerEngage for ClaimCenter',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de versão',
          docId: 'dx202306ptBRpeclaimsrelnotes',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/pe-claims')({
  component: Ceam,
});

function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
