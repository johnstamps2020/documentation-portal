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
      label: '10.9.0',
      items: [
        {
          label: 'Guía de informes',
          docId: 'ic1090reportses419',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de administración',
          url: '/l10n/es-LA/ic/10.0.0/IC10-admin-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de las aplicaciones BI',
          url: '/l10n/es-LA/ic/10.0.0/IC10-bi-applications-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración de InfoCenter',
          url: '/l10n/es-LA/ic/10.0.0/IC10-config-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de Data Specifications',
          url: '/l10n/es-LA/ic/10.0.0/IC10-dataspec-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía del producto',
          url: '/l10n/es-LA/ic/10.0.0/IC10-product-es.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
