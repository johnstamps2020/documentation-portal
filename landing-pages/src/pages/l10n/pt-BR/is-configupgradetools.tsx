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
    selectedItemLabel: 'InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '5.2.0',
      items: [
        {
          label:
            'Ferramentas de atualização de configuração do Guidewire InsuranceSuite',
          docId: 'isconfigupgradetools520ptBR',
        },
      ],
    },
    {
      label: '5.0.0',
      items: [
        {
          label:
            'Ferramentas de atualização de configuração do Guidewire InsuranceSuite',
          docId: 'isconfigupgradetoolsptBR500',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/is-configupgradetools')({
  component: Isconfigupgradetools,
});

function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
