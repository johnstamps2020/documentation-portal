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
          url: '/l10n/es-ES/sre/2022.05/es-ES v.2022.05  SRE_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/sre/11.1/es-ES-SRE-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-ES/sre/10.0.1/es-ES-SRE_AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-ES/sre/10.0.1/es-ES_SRE_ConfigurationGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/sre/10.0.1/es-ES_SRE_InstallGuide.pdf',
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
