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
          url: '/l10n/pt-BR/pe/11.1/pt-PE-cloud_InstallGuide.pdf',
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/pe/11.1/pt-PE-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de administração e segurança',
          url: '/l10n/pt-BR/pe/10.0.1/pt-PE_Admin and Security Guide.pdf',
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/pe/10.0.1/pt-PE_AppGuide.pdf',
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/pe/10.0.1/pt-PE_ConfigurationGuide.pdf',
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/pe/10.0.1/pt-PE_InstallGuide.pdf',
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          url: '/l10n/pt-BR/pe/10.0.1/pt-PE_Live Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}