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
    selectedItemLabel: 'Analytics',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'DataHub 10.0.0',
      items: [
        {
          label: 'Guida alle Specifiche dati',
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/dh/10.0.0/DH10-dataspec-it.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'InfoCenter 10.0.0',
      items: [
        {
          label: 'Guida alle applicazioni BI',
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/ic/10.0.0/IC10-bi-applications-it.pdf',
          videoIcon: false,
        },
        {
          label: 'Guida alle Specifiche dati',
          docId: 'l10npdfss3folder',
          pathInDoc: 'it-IT/ic/10.0.0/IC10-dataspec-it.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Analytics() {
  return <CategoryLayout {...pageConfig} />;
}
