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
      label: '2021.11',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'ispc202111appes419',
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
          label: 'Guía de Advanced Product Designer',
          url: '/l10n/es-LA/pc/2020.11/Cloud202011_es-419_AdvancedProductDesigner.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/pc/2020.11/PCCloud202011_es-419_ConfigGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/pc/2020.11/PCCloud202011_es-419_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/pc/2020.05/ISCL_202005_ESLA_PC-AppGuide.pdf',
        },
        {
          label: 'Guía de administración de contactos de Guidewire',
          url: '/l10n/es-LA/pc/2020.05/ISCL_202005_ESLA_PC_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de Advanced Product Designer',
          url: '/l10n/es-LA/pc/10.1.1/PC1011_es-419_AdvancedProductDesigner.pdf',
        },
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/pc/10.1.1/PC1011_es-419_AppGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/pc/10.0.2/es-PC-AppGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/pc/10.0.2/es-PC-ConfigGuide.pdf',
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/es-LA/pc/10.0.2/es-PC-RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/es-LA/pc/10.0.0/es-PC-AppGuide.pdf',
        },
        {
          label: 'Guía de administración de contactos',
          url: '/l10n/es-LA/pc/10.0.0/es-PC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/pc/10.0.0/es-PC-InstallGuide.pdf',
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/es-LA/pc/10.0.0/es-PC-RulesGuide.pdf',
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/es-LA/pc/10.0.0/es_PC-ConfigGuide.pdf',
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
