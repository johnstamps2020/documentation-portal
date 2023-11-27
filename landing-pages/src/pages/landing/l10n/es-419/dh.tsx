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
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '10.0.0',
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
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
