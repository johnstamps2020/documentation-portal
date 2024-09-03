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
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'dx202205itITpeapp',
        },
        {
          label: "Guida all'installazione",
          docId: 'dx202205itITpeinstall',
        },
      ],
    },
    {
      label: '2020.08',
      items: [
        {
          label: "Guida all'installazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/pe/2020.08/it-PE-202008-cloud-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/pe/11.3/it-PE-11.3-onprem-InstallGuide.pdf',
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
          pathInDoc: 'it-IT/pe/10.0.1/it_PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT/pe')({
  component: Pe,
});

function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
