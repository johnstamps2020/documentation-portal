import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/bc/2021.11/BC-AppGuide_pt-BR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/bc/2020.11/BCCloud202011_pt-BR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/bc/2020.11/BCCloud202011_pt-BR_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/bc/2020.05/IS_CL_202005_pt-BR_BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/bc/10.1.1/BC-AppGuide_PTBR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos da Guidewire',
          url: '/l10n/pt-BR/bc/10.1.1/BC-ContactMgmtGuide_PTBR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/bc/10.0.2/pt-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/bc/10.0.2/pt-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          url: '/l10n/pt-BR/bc/10.0.2/pt-BC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/bc/10.0.0/pt-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/bc/10.0.0/pt-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de gerenciamento de contatos',
          url: '/l10n/pt-BR/bc/10.0.0/pt-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/bc/10.0.0/pt-BC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de regras',
          url: '/l10n/pt-BR/bc/10.0.0/pt-BC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
