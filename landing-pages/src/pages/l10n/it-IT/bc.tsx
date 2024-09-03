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
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'isbc202205itITapp',
        },
        {
          label: 'Guida alla configurazione',
          docId: 'isbc202205itITconfig',
        },
        {
          label: "Guida all'installazione per sviluppatori",
          docId: 'isbc202205itITdevsetup',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guida ai flussi aziendali delle API cloud e alla configurazione',
          docId: 'isbc202111apibfitIT',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/bc/2020.05/ISCL_202005_it_IT_BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/bc/10.1.1/BC1011-it_IT-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/bc/10.0.2/it-BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/bc/10.0.0/it-BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT/bc')({
  component: Bc,
});

function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
