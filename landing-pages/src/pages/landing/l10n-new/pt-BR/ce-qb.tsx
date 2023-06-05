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
          url: '/l10n/pt-BR/ce-qb/11.1/pt-CE_QB-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de administração e segurança',
          url: '/l10n/pt-BR/ce-qb/10.0.1/pt-CE_QB_Admin and Security guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          url: '/l10n/pt-BR/ce-qb/10.0.1/pt-CE_QB_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          url: '/l10n/pt-BR/ce-qb/10.0.1/pt-CE_QB_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ce-qb/10.0.1/pt-CE_QB_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          url: '/l10n/pt-BR/ce-qb/10.0.1/pt-CE_QB_Live Style Guide Install and Config.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
