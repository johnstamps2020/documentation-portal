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
          url: '/l10n/pdfs/it-IT/ce-claims/2022.05/it-IT Digital v.2022.05 CE-AM Claims_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guida all'installazione",
          url: '/l10n/pdfs/it-IT/ce-claims/2022.05/it-IT Digital v.2022.05 CE-AM Claims InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/pdfs/it-IT/ce-claims/11.3/it-CE-Claims-11.3-onprem- InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
