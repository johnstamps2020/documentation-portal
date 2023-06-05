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
          videoIcon: false,
        },
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          url: '/l10n/fr-FR/cc/2021.11/CC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/cc/2020.11/CC_CL202011_fr-FR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/cc/2020.11/CC_CL202011_fr-FR_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/2020.05/ISCL_202005_fr_CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/cc/2020.05/ISCL_202005_fr_CC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/10.1.1/CC-AppGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/cc/10.1.1/CC-ContactMgmtGuide_FR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/10.0.2/CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/cc/10.0.2/ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/cc/10.0.2/ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/cc/10.0.2/InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/cc/10.0.2/RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de gestion des contacts',
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/cc/10.0.0/fr-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
