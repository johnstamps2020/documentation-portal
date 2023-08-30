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
      label: '2021.11',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pdfs/pt-BR/pc/2021.11/PC-AppGuide_pt-BR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guia de configuração',
          url: '/l10n/pdfs/pt-BR/pc/2020.11/PCCloud202011_pt-BR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do Advanced Product Designer',
          url: '/l10n/pdfs/pt-BR/pc/2020.11/Cloud202011_pt-BR_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pdfs/pt-BR/pc/2020.11/PCCloud202011_pt-BR_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pdfs/pt-BR/pc/2020.05/IS_CL_202005_pt-BR_PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guia de gerenciamento de contatos da Guidewire',
          url: '/l10n/pdfs/pt-BR/pc/10.1.1/PC-ContactMgmtGuide_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do Advanced Product Designer',
          url: '/l10n/pdfs/pt-BR/pc/10.1.1/AdvancedProductDesigner_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pdfs/pt-BR/pc/10.1.1/PC-AppGuide_PTBR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guia de regras',
          url: '/l10n/pdfs/pt-BR/pc/10.0.2/pt-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pdfs/pt-BR/pc/10.0.2/pt-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pdfs/pt-BR/pc/10.0.2/pt-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia de instalação',
          url: '/l10n/pdfs/pt-BR/pc/10.0.0/pt-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          url: '/l10n/pdfs/pt-BR/pc/10.0.0/pt-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pdfs/pt-BR/pc/10.0.0/pt-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos',
          url: '/l10n/pdfs/pt-BR/pc/10.0.0/pt-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pdfs/pt-BR/pc/10.0.0/pt-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}