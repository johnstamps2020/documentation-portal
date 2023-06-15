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
      label: '10.0.0',
      items: [
        {
          label: 'Guia de administração',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-admin-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de aplicativos de BI',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-bi-applications-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'InfoCenter Guia de configuração',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-config-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de especificações de dados',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-dataspec-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-install-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do produto',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-product-pt.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
