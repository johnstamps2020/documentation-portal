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
          url: '/l10n/fr-FR/ce-qb/11.4.1/fr-FR Digital v.11.4.1 CE-QB AppGuide.pdf',
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-qb/11.4.1/fr-FR-Digital v.11.4.1 CE-QB admin&security-guide.pdf',
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/ce-qb/11.4.1/fr-FR-Digital v.11.4.1 CE-QB Developers Guide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-qb/11.4.1/fr-FR-Digital v.11.4.1 CE-QB InstallGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-qb/11.1/fr-CE_QB-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/ce-qb/10.0.1/fr-CE_QA_ConfigurationGuide.pdf',
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-qb/10.0.1/fr-CE_QB_admin-and-security-guide.pdf',
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/ce-qb/10.0.1/fr-CE_QB_AppGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-qb/10.0.1/fr-CE_QB_InstallGuide.pdf',
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/ce-qb/10.0.1/fr-CE_QB_Life Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
