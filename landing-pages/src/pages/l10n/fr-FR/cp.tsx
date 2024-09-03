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
    label: 'Choisissez un produit',
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Notes de version',
      items: [
        {
          label: 'Notes de version de la plate-forme Guidewire Cloud',
          docId: 'gwcpfrFRreleasenotes',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/fr-FR/cp')({
  component: Cp,
});

function Cp() {
  return <CategoryLayout {...pageConfig} />;
}
