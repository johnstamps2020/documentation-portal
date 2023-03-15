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
          docId: 'ispc202205appesES',
        },
        {
          label: 'Guía de configuración',
          docId: 'ispc202205configesES',
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
          docId: 'ispc202111apicaesES',
        },
        {
          label:
            'Guía de configuración y flujos de negocio de la API de la nube',
          docId: 'ispc202111apibfesES',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de Advanced Product Designer',
          url: '/l10n/es-ES/pc/10.1.1/PC1011_es-ES_AdvancedProductDesigner.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-ES/pc/10.1.1/PC1011_es-ES_ConfigGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/pc/10.1.1/PC1011_es-ES_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-ES/pc/10.0.2/esES-PC-AppGuide.pdf',
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/es-ES/pc/10.0.2/esES-PC-ContactMgmtGuide.pdf',
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
