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
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/pdfs/it-IT/pe/2022.05/it-IT Digital v.2022.05 PE InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/pe/2022.05/it-IT Digital v.2022.05 PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.08',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/pdfs/it-IT/pe/2020.08/it-PE-202008-cloud-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/pdfs/it-IT/pe/11.3/it-PE-11.3-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/pdfs/it-IT/pe/10.0.1/it_PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
