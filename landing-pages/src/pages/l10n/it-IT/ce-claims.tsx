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
    label: 'Seleziona il prodotto',
    selectedItemLabel: 'CustomerEngage Account Management for ClaimCenter',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'dx202205itITceclaimsapp',
        },
        {
          label: "Guida all'installazione",
          docId: 'dx202205itITceclaimsinstall',
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'it-IT/ce-claims/11.3/it-CE-Claims-11.3-onprem- InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT/ce-claims')({
  component: Ceclaims,
});

function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
