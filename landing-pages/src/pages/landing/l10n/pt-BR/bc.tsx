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
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'Notas de versão',
          docId: 'isbc202407ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'isbc202407ptBRupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'isbc202402ptBRapp',
        },
        {
          label: 'Notas de versão',
          docId: 'isbc202402ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'isbc202402ptBRupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Notas de versão',
          docId: 'isbc202310ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'isbc202310ptBRupdate',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de versão',
          docId: 'isbc202306ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'isbc202306ptBRupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'isbc202302ptapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/2021.11/BC-AppGuide_pt-BR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/2020.11/BCCloud202011_pt-BR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/2020.11/BCCloud202011_pt-BR_InstallGuide.pdf',
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
          pathInDoc: 'pt-BR/bc/2020.05/IS_CL_202005_pt-BR_BC-AppGuide.pdf',
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
          pathInDoc: 'pt-BR/bc/10.1.1/BC-ContactMgmtGuide_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.1.1/BC-AppGuide_PTBR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guia de regras',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.2/pt-BC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.2/pt-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.2/pt-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia de regras',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.0/pt-BC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.0/pt-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.0/pt-BC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.0/pt-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/bc/10.0.0/pt-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
