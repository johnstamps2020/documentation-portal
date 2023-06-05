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
      label: '10.0.0',
      items: [
        {
          label: 'Guia de administração',
          url: '/l10n/pt-BR/dh/10.0.0/DH10-admin-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'DataHub Guia de configuração',
          url: '/l10n/pt-BR/dh/10.0.0/DH10-config-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de especificações de dados',
          url: '/l10n/pt-BR/dh/10.0.0/DH10-dataspec-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/dh/10.0.0/DH10-install-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do produto',
          url: '/l10n/pt-BR/dh/10.0.0/DH10-product-pt.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
