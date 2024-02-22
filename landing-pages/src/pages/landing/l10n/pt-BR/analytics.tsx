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
    selectedItemLabel: 'Analytics',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
		{
			label: 'Explore',
      items: [
        {
          label: 'Guia do aplicativo',
          docId: 'exploreptBRusingrelease',
        },
      ],
		},
		{
      label: 'DataHub 10.0.0',
      items: [
        {
          label: 'Guia de administração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/dh/10.0.0/DH10-admin-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de especificações de dados',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/dh/10.0.0/DH10-dataspec-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/dh/10.0.0/DH10-install-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'DataHub Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/dh/10.0.0/DH10-config-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do produto',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/dh/10.0.0/DH10-product-pt.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'InfoCenter 10.0.0',
      items: [
        {
          label: 'Guia de administração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ic/10.0.0/IC10-admin-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de aplicativos de BI',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ic/10.0.0/IC10-bi-applications-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de especificações de dados',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ic/10.0.0/IC10-dataspec-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do produto',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ic/10.0.0/IC10-product-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'InfoCenter Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ic/10.0.0/IC10-config-pt.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/ic/10.0.0/IC10-install-pt.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Analytics() {
  return <CategoryLayout {...pageConfig} />;
}
