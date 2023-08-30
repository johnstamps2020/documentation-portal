import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
          label: "Guida all'installazione per sviluppatori",
          url: '/l10n/pdfs/it-IT/bc/2022.05/BC-DeveloperSetupGuide-IT.pdf',
          videoIcon: false,
        },
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/bc/2022.05/BC-AppGuide-IT.pdf',
          videoIcon: false,
        },
        {
          label: 'Guida alla configurazione',
          url: '/l10n/pdfs/it-IT/bc/2022.05/BC-ConfigGuide_it-IT.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            'Guida ai flussi aziendali delle API cloud e alla configurazione',
          url: '/l10n/pdfs/it-IT/bc/2021.11/BC v.2021.11 it-IT CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/bc/2020.05/ISCL_202005_it_IT_BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/bc/10.1.1/BC1011-it_IT-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/bc/10.0.2/it-BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/bc/10.0.0/it-BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
