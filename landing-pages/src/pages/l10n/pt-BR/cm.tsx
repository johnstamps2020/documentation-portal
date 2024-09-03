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
    selectedItemLabel: 'InsuranceSuite Contact Management',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'Guia de gerenciamento de contatos da Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cm/2021.11/ContactMgmtGuide_pt-BR.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/cm')({
  component: Cm,
});

function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
