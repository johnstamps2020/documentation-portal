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
          url: '/l10n/es-LA/ce-am/2022.05/es-LA v.2022.05 CE-AM_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/ce-am/11.1/es-419-CE_AM-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/ce-am/10.0.1/es-CEAM-InstallGuide.pdf',
        },
        {
          label: 'Guía de seguridad y administración',
          url: '/l10n/es-LA/ce-am/10.0.1/es-CEAM_admin-and-security-guide.pdf',
        },
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-LA/ce-am/10.0.1/es-CEAM_AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/ce-am/10.0.1/es-CEAM_ConfigurationGuide.pdf',
        },
        {
          label: 'Guía de configuración e instalación de Live Style Guide',
          url: '/l10n/es-LA/ce-am/10.0.1/es-CEAM_LiveStyleGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
