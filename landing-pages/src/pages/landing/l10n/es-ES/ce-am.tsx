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
    selectedItemLabel: 'CustomerEngage Account Management',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-ES/ce-am/2022.05/es-ES v.2022.05 CE-AM_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-ES/ce-am/11.1/es-ES-CE_AM-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-ES/ce-am/10.0.1/es-ES_CEAM_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-ES/ce-am/10.0.1/es-ES_CEAM_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-ES/ce-am/10.0.1/es-ES_CEAM_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
