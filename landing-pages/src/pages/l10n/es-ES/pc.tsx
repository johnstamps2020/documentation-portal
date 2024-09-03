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
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de Advanced Product Designer para PolicyCenter',
          docId: 'ispc202205apdesES',
        },
        {
          label: 'Guía de la aplicación',
          docId: 'ispc202205appesES',
        },
        {
          label: 'Guía de configuración',
          docId: 'ispc202205configesES',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guía de configuración y flujos de negocio de la API de la nube',
          docId: 'ispc202111apibfesES',
        },
        {
          label: 'Guía de autenticación de la API de la nube',
          docId: 'ispc202111apicaesES',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guía de Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/pc/10.1.1/PC1011_es-ES_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/pc/10.1.1/PC1011_es-ES_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/pc/10.1.1/PC1011_es-ES_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de gestión de contactos de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/pc/10.0.2/esES-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/pc/10.0.2/esES-PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-ES/pc')({
  component: Pc,
});

function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
