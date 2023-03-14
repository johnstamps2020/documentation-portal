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
  selector: undefined,

  cards: [
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR Digital v.11.4.1 CE-AM AppGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR Digital v.11.4.1 CE-AM InstallGuide.pdf',
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR-Digital v.11.4.1 CE-AM admin&security-guide.pdf',
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/ce-am/11.4.1/fr-FR-Digital v.11.4.1 CE-AM DevelopersGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-am/11.1/fr-CE_AM-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_admin-and-security-guide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_ConfigurationGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_InstallGuide.pdf',
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM_Life_Style_Guide Install and Config.pdf',
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/ce-am/10.0.1/fr-CE_AM__AppGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
