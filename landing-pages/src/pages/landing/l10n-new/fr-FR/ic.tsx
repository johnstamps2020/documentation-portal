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
          label: "Guide d'administration",
          url: '/l10n/fr-FR/ic/10.0.0/IC10-admin-fr.pdf',
        },
        {
          label: 'Guide de configuration InfoCenter',
          url: '/l10n/fr-FR/ic/10.0.0/IC10-config-fr.pdf',
        },
        {
          label: 'Guide des spécifications de données',
          url: '/l10n/fr-FR/ic/10.0.0/IC10-dataspec-fr.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ic/10.0.0/IC10-install-fr.pdf',
        },
        {
          label: 'Guide de mise à niveau',
          url: '/l10n/fr-FR/ic/10.0.0/IC10-upgrade-fr.pdf',
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
