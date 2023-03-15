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

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Administrationshandbuch',
          url: '/l10n/de-DE/dh/10.0.0/DH10-admin-de.pdf',
        },
        {
          label: 'DataHub Konfigurationshandbuch',
          url: '/l10n/de-DE/dh/10.0.0/DH10-config-de.pdf',
        },
        {
          label: 'Leitfaden zur Datenspezifikation',
          url: '/l10n/de-DE/dh/10.0.0/DH10-dataspec-de.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/dh/10.0.0/DH10-install-de.pdf',
        },
        {
          label: 'Berichtshandbuch',
          url: '/l10n/de-DE/dh/10.0.0/DH10-reports-de.pdf',
        },
        {
          label: 'Upgrade-Handbuch',
          url: '/l10n/de-DE/dh/10.0.0/DH10-upgrade-de.pdf',
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
