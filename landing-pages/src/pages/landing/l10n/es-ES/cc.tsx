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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-ES/cc/2022.05/CC-AppGuide_es-ES.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-ES/cc/2022.05/CC-ConfigGuide_es-ES.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guía de configuración y flujos de negocio de la API de la nube',
          url: '/l10n/pdfs/es-ES/cc/2021.11/CC v.2021.11 es-ES CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de autenticación de la API de la nube',
          url: '/l10n/pdfs/es-ES/cc/2021.11/CC v.2021.11 es-ES CloudAPIGuide-Auth.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-ES/cc/10.0.2/esES-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/pdfs/es-ES/cc/10.0.2/esES-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/pdfs/es-ES/cc/10.0.2/esES-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-ES/cc/10.0.2/esES-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-ES/cc/10.0.2/esES-CC-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
