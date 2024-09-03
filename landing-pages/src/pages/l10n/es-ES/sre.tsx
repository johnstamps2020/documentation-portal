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
    selectedItemLabel: 'ServiceRepEngage',
    items: allSelectors.s1e7e42f043fbc93c9128db9850dbcb2d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/sre/2022.05/es-ES v.2022.05  SRE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/sre/11.1/es-ES-SRE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de instalación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/sre/10.0.1/es-ES_SRE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/sre/10.0.1/es-ES_SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de la aplicación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/sre/10.0.1/es-ES-SRE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-ES/sre')({
  component: Sre,
});

function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
