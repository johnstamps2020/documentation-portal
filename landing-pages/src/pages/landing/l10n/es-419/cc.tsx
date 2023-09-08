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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.02',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'iscc202302appes419',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-LA/cc/2021.11/CC-AppGuide-ESLA.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/cc/2020.11/CCCloud202011_es-419_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-LA/cc/2020.11/CCCloud202011_es-419_ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-LA/cc/2020.05/ISCL_202005_ESLA_CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de administración de contactos de Guidewire',
          url: '/l10n/pdfs/es-LA/cc/2020.05/ISCL_202005_ESLA_CC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-LA/cc/10.1.1/CC1011_es-419_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-LA/cc/10.0.2/es-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/pdfs/es-LA/cc/10.0.2/es-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-LA/cc/10.0.2/es-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/cc/10.0.0/es-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          url: '/l10n/pdfs/es-LA/cc/10.0.0/es-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de reglas',
          url: '/l10n/pdfs/es-LA/cc/10.0.0/es-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-LA/cc/10.0.0/es-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de administración de contactos',
          url: '/l10n/pdfs/es-LA/cc/10.0.0/es-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
