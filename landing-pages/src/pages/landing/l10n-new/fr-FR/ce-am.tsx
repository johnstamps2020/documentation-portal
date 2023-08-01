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
          docId: 'dx202302frFRceamapp',
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR Digital v.11.4.1 CE-AM AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR Digital v.11.4.1 CE-AM InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR-Digital v.11.4.1 CE-AM admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR-Digital v.11.4.1 CE-AM DevelopersGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-am/11.1/fr-CE_AM-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_Life_Style_Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM__AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
