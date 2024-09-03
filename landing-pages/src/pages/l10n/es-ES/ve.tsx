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
    selectedItemLabel: 'VendorEngage',
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
          pathInDoc: 'es-ES/ve/2022.05/es-ES v.2022.05 VE_AppGuide.pdf',
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
          pathInDoc: 'es-ES/ve/11.1/es-ES-VE-onprem-InstallGuide.pdf',
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
          pathInDoc: 'es-ES/ve/10.0.1/es-ES_VE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de la aplicación',
          docId: 'l10npdfss3folder',
          pathInDoc: 'es-ES/ve/10.0.1/es-ES_VE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-ES/ve')({
  component: Ve,
});

function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
