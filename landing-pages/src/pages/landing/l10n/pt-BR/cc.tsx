import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Selecione o produto',
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.10 (Innsbruck)', 
      items: [
      {
      label: 'Notas de versão', 
      docId: 'iscc202310ptBRreleasenotes', 
      }, 
      {
      label: 'Guia de atualização', 
      docId: 'iscc202310ptBRupdate', 
      }, 
      ],
      },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de versão',
          docId: 'iscc202306ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'iscc202306ptBRupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'iscc202302ptapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/2021.11/CC-AppGuide_pt-BR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/2020.11/CCCloud202011_pt-BR_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/2020.11/CCCloud202011_pt-BR_ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/2020.05/IS_CL_202005_pt-BR_CC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guia de gerenciamento de contatos da Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.1.1/CC-ContactMgmtGuide_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.1.1/CC-AppGuide_PTBR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.2/pt-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.2/pt-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.2/pt-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.0/pt-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.0/pt-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.0/pt-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.0/pt-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/cc/10.0.0/pt-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
