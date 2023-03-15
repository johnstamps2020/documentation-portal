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
      label: '11.1',
      items: [
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ce-am/11.1/pt-CE-AM-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de administração e segurança',
          url: '/l10n/pt-BR/ce-am/10.0.1/pt-CE_AM_admin-and-security-guide..pdf',
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/ce-am/10.0.1/pt-CE_AM_AppGuide.pdf',
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/ce-am/10.0.1/pt-CE_AM_ConfigurationGuide.pdf',
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ce-am/10.0.1/pt-CE_AM_InstallGuide.pdf',
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          url: '/l10n/pt-BR/ce-am/10.0.1/pt-CE_AM_Live Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
