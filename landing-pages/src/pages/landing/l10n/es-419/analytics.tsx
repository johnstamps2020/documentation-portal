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
    selectedItemLabel: 'Analytics',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Explore',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'explorees419usingrelease',
        },
      ],
    },
    {
      label: 'DataHub 10.0.0',
      items: [
        {
          label: 'Guía de configuración de DataHub',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/dh/10.0.0/DH10-config-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de administración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/dh/10.0.0/DH10-admin-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de Data Specifications',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/dh/10.0.0/DH10-dataspec-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía del producto',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/dh/10.0.0/DH10-product-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/dh/10.0.0/DH10-install-es.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'InfoCenter 10.0.0',
      items: [
        {
          label: 'Guía de administración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/ic/10.0.0/IC10-admin-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración de InfoCenter',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/ic/10.0.0/IC10-config-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de Data Specifications',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/ic/10.0.0/IC10-dataspec-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de las aplicaciones BI',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/ic/10.0.0/IC10-bi-applications-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía del producto',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/ic/10.0.0/IC10-product-es.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'InfoCenter 10.9.0',
      items: [
        {
          label: 'Guía de informes',
          docId: 'ic1090reportses419',
        },
      ],
    },
  ],
};

export default function Analytics() {
  return <CategoryLayout {...pageConfig} />;
}
