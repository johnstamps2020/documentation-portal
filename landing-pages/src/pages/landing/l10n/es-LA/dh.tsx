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
    label: 'Seleccionar producto',
    selectedItemLabel: 'DataHub',
    items: allSelectors.s641a38c0db32b1509b9fabce309d960f,
    labelColor: 'white',
  },

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de configuración de DataHub',
          url: '/l10n/pdfs/es-LA/dh/10.0.0/DH10-config-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de administración',
          url: '/l10n/pdfs/es-LA/dh/10.0.0/DH10-admin-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de Data Specifications',
          url: '/l10n/pdfs/es-LA/dh/10.0.0/DH10-dataspec-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía del producto',
          url: '/l10n/pdfs/es-LA/dh/10.0.0/DH10-product-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/dh/10.0.0/DH10-install-es.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
