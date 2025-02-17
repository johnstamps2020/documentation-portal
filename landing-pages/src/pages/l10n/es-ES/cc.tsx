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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'iscc202205appesES',
        },
        {
          label: 'Guía de configuración',
          docId: 'iscc202205configesES',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guía de configuración y flujos de negocio de la API de la nube',
          docId: 'iscc202111apibfesES',
        },
        {
          label: 'Guía de autenticación de la API de la nube',
          docId: 'iscc202111apicaesES',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/cc/10.0.2/esES-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de reglas',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/cc/10.0.2/esES-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de gestión de contactos de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/cc/10.0.2/esES-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de aplicaciones',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/cc/10.0.2/esES-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/cc/10.0.2/esES-CC-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-ES/cc')({
  component: Cc,
});

function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
