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
          url: '/l10n/fr-FR/pe/11.4.1/fr-FR Digital v.11.4.1 PE AppGuide.pdf',
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/pe/11.4.1/fr-FR-Digital v.11.4.1 PE admin&security-guide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pe/11.4.1/fr-FR-Digital v.11.4.1 PE InstallGuide.pdf',
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/pe/11.4.1/fr-FR-Digital v.11.4.1 PE-DevelopersGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pe/11.1/fr-PE-cloud_InstallGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pe/11.1/fr-PE-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/pe/10.0.1/fr-PE_admin-and-security-guide.pdf',
        },
        {
          label: 'Guide des applications',
          url: '/l10n/fr-FR/pe/10.0.1/fr-PE_AppGuide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/pe/10.0.1/fr-PE_ConfigurationGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pe/10.0.1/fr-PE_InstallGuide.pdf',
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/fr-FR/pe/10.0.1/fr-PE_Life Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
