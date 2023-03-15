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
      label: '2021.11',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'isbc202111appes419',
        },
        {
          label: 'Guía de administración de contactos de Guidewire',
          docId: 'is202111contactes419',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/bc/2020.11/BCCloud202011_es-419_ConfigGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/bc/2020.11/BCCloud202011_es-419_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/bc/2020.05/ISCL_202005_ESLA_BC-AppGuide.pdf',
        },
        {
          label: 'Guía de administración de contactos de Guidewire',
          url: '/l10n/es-LA/bc/2020.05/ISCL_202005_ESLA_BC_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/bc/10.1.1/BC1011_es-419_AppGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/bc/10.0.2/es-BC-AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/bc/10.0.2/es-BC-ConfigGuide.pdf',
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/es-LA/bc/10.0.2/es-BC-RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/bc/10.0.0/es-BC-AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/bc/10.0.0/es-BC-ConfigGuide.pdf',
        },
        {
          label: 'Guía de administración de contactos',
          url: '/l10n/es-LA/bc/10.0.0/es-BC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/bc/10.0.0/es-BC-InstallGuide.pdf',
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/es-LA/bc/10.0.0/es-BC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
