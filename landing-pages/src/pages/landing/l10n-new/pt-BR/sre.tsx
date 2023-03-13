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
          url: '/l10n/pt-BR/sre/11.1/pt-SRE-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de administração e segurança',
          url: '/l10n/pt-BR/sre/10.0.1/pt-SRE_Admin-and-Security Guide.pdf',
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/sre/10.0.1/pt-SRE_AppGuide.pdf',
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/sre/10.0.1/pt-SRE_ConfigurationGuide.pdf',
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/sre/10.0.1/pt-SRE_InstallGuide.pdf',
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          url: '/l10n/pt-BR/sre/10.0.1/pt-SRE_Live Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
