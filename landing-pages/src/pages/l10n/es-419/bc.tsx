import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Seleccionar producto',
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'Guía de renovación',
          docId: 'isbc202407es419update',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'isbc202402es419app',
        },
        {
          label: 'Guía de renovación',
          docId: 'isbc202402es419update',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Notas de la versión',
          docId: 'isbc202310es419releasenotes',
        },
        {
          label: 'Guía de renovación',
          docId: 'isbc202310es419update',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de la versión',
          docId: 'isbc202306es419releasenotes',
        },
        {
          label: 'Guía de renovación',
          docId: 'isbc202306es419update',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'isbc202302appes419',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/2021.11/BC-AppGuide-ESLA.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/2020.11/BCCloud202011_es-419_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/2020.11/BCCloud202011_es-419_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guía de administración de contactos de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'es-LA/bc/2020.05/ISCL_202005_ESLA_BC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/2020.05/ISCL_202005_ESLA_BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.1.1/BC1011_es-419_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de reglas',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.2/es-BC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.2/es-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.2/es-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.0/es-BC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de reglas',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.0/es-BC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.0/es-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de administración de contactos',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.0/es-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/bc/10.0.0/es-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-419/bc')({
  component: Bc,
});

function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
