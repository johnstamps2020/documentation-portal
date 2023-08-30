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
    selectedItemLabel: 'Guidewire Cloud Console',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '0',
      items: [
        {
          label: 'Guidewire Cloud Console',
          url: '/l10n/pdfs/it-IT/gcc/0/IT-GuidewireCloudConsole.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}
