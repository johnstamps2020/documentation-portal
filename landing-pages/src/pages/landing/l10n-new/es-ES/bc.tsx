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
          url: '/l10n/es-ES/bc/10.1.1/BC1011_es-ES_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/bc/10.1.1/BC1011_es-ES_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-ES/bc/10.0.2/esES-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/es-ES/bc/10.0.2/esES-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
