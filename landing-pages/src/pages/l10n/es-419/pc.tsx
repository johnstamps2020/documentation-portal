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
    selectedItemLabel: 'PolicyCenter',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'PolicyCenter Guía de renovación',
          docId: 'ispc202407es419update',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'ispc202402es419app',
        },
        {
          label: 'PolicyCenter Guía de renovación',
          docId: 'ispc202402es419update',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'PolicyCenter Notas de la versión',
          docId: 'ispc202310es419releasenotes',
        },
        {
          label: 'PolicyCenter Guía de renovación',
          docId: 'ispc202310es419update',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de la versión',
          docId: 'ispc202306es419releasenotes',
        },
        {
          label: 'Guía de renovación',
          docId: 'ispc202306es419update',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'ispc202302appes419',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/2021.11/PC-AppGuide-ESLA.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/2020.11/PCCloud202011_es-419_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/2020.11/PCCloud202011_es-419_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'es-LA/pc/2020.11/Cloud202011_es-419_AdvancedProductDesigner.pdf',
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
            'es-LA/pc/2020.05/ISCL_202005_ESLA_PC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/2020.05/ISCL_202005_ESLA_PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'es-LA/pc/10.1.1/PC1011_es-419_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.1.1/PC1011_es-419_AppGuide.pdf',
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
          pathInDoc: 'es-LA/pc/10.0.2/es-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.2/es-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.2/es-PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de reglas',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.0/es-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.0/es-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.0/es-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.0/es_PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de administración de contactos',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-LA/pc/10.0.0/es-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-419/pc')({
  component: Pc,
});

function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
