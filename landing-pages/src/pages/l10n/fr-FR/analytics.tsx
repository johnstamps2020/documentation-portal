import { createFileRoute } from '@tanstack/react-router';
import { allSelectors } from 'components/allSelectors';
import CategoryLayout, { CategoryLayoutProps } from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Choisissez un produit',
    selectedItemLabel: 'Analytics',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Explore',
      items: [
        {
          label: 'Guidewire Explore',
          docId: 'exploreusingfrFRrelease',
        },
      ],
    },
    {
      label: 'Data Studio',
      items: [
        {
          label: 'Data Studio',
          docId: 'datastudiofrFRrelease',
        },
      ],
    },
    {
      label: 'DataHub 10.0.0',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/dh/10.0.0/DH10-install-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration DataHub',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/dh/10.0.0/DH10-config-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de mise à niveau',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/dh/10.0.0/DH10-upgrade-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/dh/10.0.0/DH10-admin-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des spécifications de données',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/dh/10.0.0/DH10-dataspec-fr.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'InfoCenter 10.0.0',
      items: [
        {
          label: 'Guide de mise à niveau',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ic/10.0.0/IC10-upgrade-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ic/10.0.0/IC10-install-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ic/10.0.0/IC10-admin-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration InfoCenter',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ic/10.0.0/IC10-config-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des spécifications de données',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ic/10.0.0/IC10-dataspec-fr.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/fr-FR/analytics')({
  component: Analytics,
});

function Analytics() {
  return <CategoryLayout {...pageConfig} />;
}
