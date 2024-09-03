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
    selectedItemLabel: 'CustomerEngage Account Management',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de versão',
          docId: 'dx202306ptBRceamrelnotes',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ce-am/11.1/pt-CE-AM-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ce-am/10.0.1/pt-CE_AM_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ce-am/10.0.1/pt-CE_AM_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ce-am/10.0.1/pt-CE_AM_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'pt-BR/ce-am/10.0.1/pt-CE_AM_Live Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de administração e segurança',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'pt-BR/ce-am/10.0.1/pt-CE_AM_admin-and-security-guide..pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/ce-am')({
  component: Ceam,
});

function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
