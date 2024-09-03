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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'iscc202205itITapp',
        },
        {
          label: 'Guida alla configurazione',
          docId: 'iscc202205itITconfig',
        },
        {
          label: "Guida all'installazione per sviluppatori",
          docId: 'iscc202205itITdevsetup',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guida ai flussi aziendali delle API cloud e alla configurazione',
          docId: 'iscc202111apibfitIT',
        },
        {
          label: "Guida all'autenticazione per l'API cloud",
          docId: 'iscc202111apicaitIT',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/cc/2020.05/ISCL_202005_it_IT_CC-AppGuide.pdf',
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
          pathInDoc: 'it-IT/cc/10.1.1/CC1011-it_IT-AppGuide.pdf',
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
          pathInDoc: 'it-IT/cc/10.0.2/it-CC-AppGuide.pdf',
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
          pathInDoc: 'it-IT/cc/10.0.0/it-CC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT/cc')({
  component: Cc,
});

function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
