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
    label: 'Choisissez un produit',
    selectedItemLabel: 'DataHub',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/dh/10.0.0/DH10-install-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration DataHub',
          url: '/l10n/pdfs/fr-FR/dh/10.0.0/DH10-config-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de mise à niveau',
          url: '/l10n/pdfs/fr-FR/dh/10.0.0/DH10-upgrade-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration",
          url: '/l10n/pdfs/fr-FR/dh/10.0.0/DH10-admin-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des spécifications de données',
          url: '/l10n/pdfs/fr-FR/dh/10.0.0/DH10-dataspec-fr.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
