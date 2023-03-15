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
      label: '2021.11',
      items: [
        {
          label: "Guide d'authentification de l'API Cloud",
          url: '/l10n/fr-FR/cc/2021.11/CC v.2021.11 fr-FR CloudAPIGuide-Auth.pdf',
        },
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          url: '/l10n/fr-FR/cc/2021.11/CC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/cc/2020.11/CC_CL202011_fr-FR_ConfigGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/cc/2020.11/CC_CL202011_fr-FR_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/2020.05/ISCL_202005_fr_CC-AppGuide.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/cc/2020.05/ISCL_202005_fr_CC_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/10.1.1/CC-AppGuide_FR.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/cc/10.1.1/CC-ContactMgmtGuide_FR.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/10.0.2/CC-AppGuide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/cc/10.0.2/ConfigGuide.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/cc/10.0.2/ContactMgmtGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/cc/10.0.2/InstallGuide.pdf',
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/cc/10.0.2/RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-AppGuide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-ConfigGuide.pdf',
        },
        {
          label: 'Guide de gestion des contacts',
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-ContactMgmtGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-InstallGuide.pdf',
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
