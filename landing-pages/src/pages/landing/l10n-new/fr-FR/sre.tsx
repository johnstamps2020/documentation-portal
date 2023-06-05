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
          url: '/l10n/fr-FR/sre/11.4.1/fr-FR Digital v.11.4.1 SRE AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/sre/11.4.1/fr-FR-Digital v.11.4.1 SRE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/sre/11.4.1/fr-FR-Digital v.11.4.1 SRE InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/sre/11.4.1/fr-FR-Digital v.11.4.1 SRE-DevelopersGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/sre/11.1/fr-SRE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/sre/10.0.1/fr-SRE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/sre/10.0.1/fr-SRE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/sre/10.0.1/fr-SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/sre/10.0.1/fr-SRE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/sre/10.0.1/fr-SRE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
