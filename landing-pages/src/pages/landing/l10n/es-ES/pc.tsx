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
    selectedItemLabel: 'PolicyCenter',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de Advanced Product Designer para PolicyCenter',
          url: '/l10n/pdfs/es-ES/pc/2022.05/AdvancedProductDesigner_es-ES.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-ES/pc/2022.05/PC-ConfigGuide_es-ES.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-ES/pc/2022.05/PC-AppGuide_es-ES.pdf',
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
          url: '/l10n/pdfs/es-ES/pc/2021.11/PC v.2021.11 es-ES CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de autenticación de la API de la nube',
          url: '/l10n/pdfs/es-ES/pc/2021.11/PC v.2021.11 es-ES CloudAPIGuide-Auth.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de Advanced Product Designer',
          url: '/l10n/pdfs/es-ES/pc/10.1.1/PC1011_es-ES_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-ES/pc/10.1.1/PC1011_es-ES_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-ES/pc/10.1.1/PC1011_es-ES_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de gestión de contactos de Guidewire',
          url: '/l10n/pdfs/es-ES/pc/10.0.2/esES-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-ES/pc/10.0.2/esES-PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
