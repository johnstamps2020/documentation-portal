import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Administrationshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-admin-de.pdf',
          videoIcon: false,
        },
        {
          label: 'BI-Anwendungshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-bi-applications-de.pdf',
          videoIcon: false,
        },
        {
          label: 'InfoCenter Konfigurationshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-config-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Leitfaden zur Datenspezifikation',
          url: '/l10n/de-DE/ic/10.0.0/IC10-dataspec-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-install-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Produkthandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-product-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Berichtshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-reports-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Upgrade-Handbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-upgrade-de.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
