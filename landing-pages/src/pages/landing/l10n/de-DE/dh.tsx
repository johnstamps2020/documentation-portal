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
    label: 'Produkt auswählen',
    selectedItemLabel: 'DataHub',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Berichtshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/dh/10.0.0/DH10-reports-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Upgrade-Handbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/dh/10.0.0/DH10-upgrade-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/dh/10.0.0/DH10-install-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Leitfaden zur Datenspezifikation',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/dh/10.0.0/DH10-dataspec-de.pdf',
          videoIcon: false,
        },
        {
          label: 'DataHub Konfigurationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/dh/10.0.0/DH10-config-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/dh/10.0.0/DH10-admin-de.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
