import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Selecione o produto',
    selectedItemLabel: 'DataHub',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guia de administração',
          url: '/l10n/pdfs/pt-BR/dh/10.0.0/DH10-admin-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de especificações de dados',
          url: '/l10n/pdfs/pt-BR/dh/10.0.0/DH10-dataspec-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          url: '/l10n/pdfs/pt-BR/dh/10.0.0/DH10-install-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'DataHub Guia de configuração',
          url: '/l10n/pdfs/pt-BR/dh/10.0.0/DH10-config-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do produto',
          url: '/l10n/pdfs/pt-BR/dh/10.0.0/DH10-product-pt.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
