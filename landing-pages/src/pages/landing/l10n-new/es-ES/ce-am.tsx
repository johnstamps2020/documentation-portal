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
          url: '/l10n/es-ES/ce-am/2022.05/es-ES v.2022.05 CE-AM_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/ce-am/11.1/es-ES-CE_AM-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-ES/ce-am/10.0.1/es-ES_CEAM_AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-ES/ce-am/10.0.1/es-ES_CEAM_ConfigurationGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/ce-am/10.0.1/es-ES_CEAM_InstallGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
