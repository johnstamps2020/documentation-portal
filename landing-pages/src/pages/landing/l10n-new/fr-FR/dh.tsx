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
          label: "Guide d'administration",
          url: '/l10n/fr-FR/dh/10.0.0/DH10-admin-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration DataHub',
          url: '/l10n/fr-FR/dh/10.0.0/DH10-config-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des spécifications de données',
          url: '/l10n/fr-FR/dh/10.0.0/DH10-dataspec-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/dh/10.0.0/DH10-install-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de mise à niveau',
          url: '/l10n/fr-FR/dh/10.0.0/DH10-upgrade-fr.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
