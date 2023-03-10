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
  selector: undefined,

  cards: [
    {
      label: '11.1',
      items: [
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ve/11.1/pt-VE-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de administração e segurança',
          url: '/l10n/pt-BR/ve/10.0.1/pt-VE_Admin and Security Guide.pdf',
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/ve/10.0.1/pt-VE_AppGuide.pdf',
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ve/10.0.1/pt-VE_InstallGuide.pdf',
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          url: '/l10n/pt-BR/ve/10.0.1/pt-VE_Live Style Guide Installand Config.pdf',
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
