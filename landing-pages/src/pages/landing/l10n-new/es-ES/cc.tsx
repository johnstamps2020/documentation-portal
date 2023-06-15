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
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'iscc202205appesES',
        },
        {
          label: 'Guía de configuración',
          docId: 'iscc202205configesES',
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          docId: 'is202205contactesES',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guía de autenticación de la API de la nube',
          docId: 'iscc202111apicaesES',
        },
        {
          label:
            'Guía de configuración y flujos de negocio de la API de la nube',
          docId: 'iscc202111apibfesES',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
