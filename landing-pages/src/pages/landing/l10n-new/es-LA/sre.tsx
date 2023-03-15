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
          url: '/l10n/es-LA/sre/2022.05/es-LA-v.2022.05 SRE_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/sre/11.1/es-419-SRE-onprem_InstallGuide.pdf.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de seguridad y administración',
          url: '/l10n/es-LA/sre/10.0.1/es-SRE_admin-and-security-guide.pdf',
        },
        {
          label: 'Guía de la aplicación',
          url: '/l10n/es-LA/sre/10.0.1/es-SRE_AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/sre/10.0.1/es-SRE_ConfigurationGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/sre/10.0.1/es-SRE_InstallGuide.pdf',
        },
        {
          label: 'Guía de configuración e instalación de Live Style Guide',
          url: '/l10n/es-LA/sre/10.0.1/es-SRE_LiveStyleGuide.pdf',
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
