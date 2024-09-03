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
    selectedItemLabel: 'CustomerEngage Quote and Buy',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'dx202205itITceqbapp',
        },
        {
          label: "Guida all'installazione",
          docId: 'dx202205itITceqbinstall',
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/ce-qb/11.3/it-CEQB-11.3-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/ce-qb/10.0.1/it-CEQB_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT/ce-qb')({
  component: Ceqb,
});

function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
