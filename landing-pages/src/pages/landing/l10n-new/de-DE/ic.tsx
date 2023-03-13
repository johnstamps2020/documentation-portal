import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: undefined,

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Administrationshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-admin-de.pdf',
        },
        {
          label: 'BI-Anwendungshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-bi-applications-de.pdf',
        },
        {
          label: 'InfoCenter Konfigurationshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-config-de.pdf',
        },
        {
          label: 'Leitfaden zur Datenspezifikation',
          url: '/l10n/de-DE/ic/10.0.0/IC10-dataspec-de.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-install-de.pdf',
        },
        {
          label: 'Produkthandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-product-de.pdf',
        },
        {
          label: 'Berichtshandbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-reports-de.pdf',
        },
        {
          label: 'Upgrade-Handbuch',
          url: '/l10n/de-DE/ic/10.0.0/IC10-upgrade-de.pdf',
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
