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
    selectedItemLabel: 'Guidewire Identity Federation Hub',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.04',
      items: [
        {
          label: 'Autenticazione con Guidewire Identity Federation Hub',
          url: '/l10n/pdfs/it-IT/gwid/2021.04/IT-GW-FederationHub.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gwid() {
  return <CategoryLayout {...pageConfig} />;
}
