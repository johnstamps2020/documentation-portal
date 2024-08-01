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
    selectedItemLabel: 'PolicyCenter',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'Notas de versão',
          docId: 'ispc202407ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'ispc202407ptBRupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'ispc202402ptBRapp',
        },
        {
          label: 'Notas de versão',
          docId: 'ispc202402ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'ispc202402ptBRupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Notas de versão',
          docId: 'ispc202310ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'ispc202310ptBRupdate',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de versão',
          docId: 'ispc202306ptBRreleasenotes',
        },
        {
          label: 'Guia de atualização',
          docId: 'ispc202306ptBRupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'ispc202302ptapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/2021.11/PC-AppGuide_pt-BR.pdf',
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
          pathInDoc: 'pt-BR/pc/2020.11/PCCloud202011_pt-BR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'pt-BR/pc/2020.11/Cloud202011_pt-BR_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/2020.11/PCCloud202011_pt-BR_InstallGuide.pdf',
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
          pathInDoc: 'pt-BR/pc/2020.05/IS_CL_202005_pt-BR_PC-AppGuide.pdf',
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
          pathInDoc: 'pt-BR/pc/10.1.1/PC-ContactMgmtGuide_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.1.1/AdvancedProductDesigner_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.1.1/PC-AppGuide_PTBR.pdf',
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
          pathInDoc: 'pt-BR/pc/10.0.2/pt-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.2/pt-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.2/pt-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.0/pt-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.0/pt-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.0/pt-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.0/pt-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pc/10.0.0/pt-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
