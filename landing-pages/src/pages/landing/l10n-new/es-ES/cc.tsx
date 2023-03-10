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
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-ConfigGuide.pdf',
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-InstallGuide.pdf',
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/es-ES/cc/10.0.2/esES-CC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
