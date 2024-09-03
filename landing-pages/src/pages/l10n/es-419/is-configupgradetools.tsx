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
    selectedItemLabel: 'InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.sc63ff31ab2489ea7a914b16720221401,
    labelColor: 'white',
  },

  cards: [
    {
      label: '5.2.0',
      items: [
        {
          label: 'Guía de herramientas de actualización de configuración',
          docId: 'isconfigupgradetools520es419',
        },
      ],
    },
    {
      label: '5.0.0',
      items: [
        {
          label: 'Guía de herramientas de actualización de configuración',
          docId: 'isconfigupgradetoolses419500',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/es-419/is-configupgradetools')({
  component: Isconfigupgradetools,
});

function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
