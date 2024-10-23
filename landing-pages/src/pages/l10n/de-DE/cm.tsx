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
    selectedItemLabel: 'InsuranceSuite Contact Management',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07',
      items: [
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          docId: 'is202407deDEcontact',
        },
      ],
    },
    {
      label: '2022.05',
      items: [
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          docId: 'is202205contactdeDE',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/de-DE/cm')({
  component: Cm,
});

function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
