import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/cc/2021.11/CC-AppGuide_pt-BR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/cc/2020.11/CCCloud202011_pt-BR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/cc/2020.11/CCCloud202011_pt-BR_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/cc/2020.05/IS_CL_202005_pt-BR_CC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/cc/10.1.1/CC-AppGuide_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos da Guidewire',
          url: '/l10n/pt-BR/cc/10.1.1/CC-ContactMgmtGuide_PTBR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/cc/10.0.2/pt-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/cc/10.0.2/pt-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          url: '/l10n/pt-BR/cc/10.0.2/pt-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/cc/10.0.0/pt-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/cc/10.0.0/pt-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos',
          url: '/l10n/pt-BR/cc/10.0.0/pt-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/cc/10.0.0/pt-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          url: '/l10n/pt-BR/cc/10.0.0/pt-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
