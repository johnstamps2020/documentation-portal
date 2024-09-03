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
    label: 'Produkt auswählen',
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Versionshinweise',
      items: [
        {
          label: 'Guidewire Cloud Platform - Versionshinweise',
          docId: 'gwcpdeDEreleasenotes',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/de-DE/cp')({
  component: Cp,
});

function Cp() {
  return <CategoryLayout {...pageConfig} />;
}
