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
          url: '/l10n/es-ES/ve/2022.05/es-ES v.2022.05 VE_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/ve/11.1/es-ES-VE-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-ES/ve/10.0.1/es-ES_VE_AppGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-ES/ve/10.0.1/es-ES_VE_InstallGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
