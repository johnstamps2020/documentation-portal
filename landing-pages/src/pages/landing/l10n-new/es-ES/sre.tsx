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
          url: '/l10n/es-ES/sre/2022.05/es-ES v.2022.05  SRE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/sre/11.1/es-ES-SRE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-ES/sre/10.0.1/es-ES-SRE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-ES/sre/10.0.1/es-ES_SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/sre/10.0.1/es-ES_SRE_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
