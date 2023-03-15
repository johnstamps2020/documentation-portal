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
      label: '11.4.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR Digital v.11.4.1 VE AppGuide.pdf',
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE admin&security-guide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE InstallGuide.pdf',
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE-DevelopersGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ve/11.1/fr-VE-11.1_onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_admin-and-security-guide.pdf',
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_AppGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_InstallGuide_fr.pdf',
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/ve/10.0.1/fr-VE_Life Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
