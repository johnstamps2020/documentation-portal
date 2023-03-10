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
      label: '10.0.0',
      items: [
        {
          label: 'Guia de administração',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-admin-pt.pdf',
        },
        {
          label: 'Guia de aplicativos de BI',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-bi-applications-pt.pdf',
        },
        {
          label: 'InfoCenter Guia de configuração',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-config-pt.pdf',
        },
        {
          label: 'Guia de especificações de dados',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-dataspec-pt.pdf',
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-install-pt.pdf',
        },
        {
          label: 'Guia do produto',
          url: '/l10n/pt-BR/ic/10.0.0/IC10-product-pt.pdf',
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
