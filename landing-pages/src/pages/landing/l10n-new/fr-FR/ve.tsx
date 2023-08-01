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
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRveapp',
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR Digital v.11.4.1 VE AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE-DevelopersGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ve/11.1/fr-VE-11.1_onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_InstallGuide_fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
