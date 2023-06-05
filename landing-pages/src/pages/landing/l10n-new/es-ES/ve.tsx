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
          url: '/l10n/es-ES/ve/2022.05/es-ES v.2022.05 VE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/ve/11.1/es-ES-VE-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-ES/ve/10.0.1/es-ES_VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/ve/10.0.1/es-ES_VE_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
