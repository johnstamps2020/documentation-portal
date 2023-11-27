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
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'isbc202205appesES',
        },
        {
          label: 'Guía de configuración',
          docId: 'isbc202205configesES',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guía de configuración y flujos de negocio de la API de la nube',
          docId: 'isbc202111apibfesES',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/bc/10.1.1/BC1011_es-ES_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/bc/10.1.1/BC1011_es-ES_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/bc/10.0.2/esES-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/bc/10.0.2/esES-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
