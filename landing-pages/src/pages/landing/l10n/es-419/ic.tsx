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
    selectedItemLabel: 'InfoCenter',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
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
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
