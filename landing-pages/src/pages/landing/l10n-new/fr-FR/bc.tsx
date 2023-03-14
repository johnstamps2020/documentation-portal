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
      label: '2021.11',
      items: [
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          url: '/l10n/fr-FR/bc/2021.11/BC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/bc/2020.11/BC_CL202011_fr-FR_ConfigGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/bc/2020.11/BC_CL202011_fr-FR_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/bc/2020.05/ISCL_202005_fr_BC-AppGuide.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/bc/2020.05/ISCL_202005_fr_BC_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/bc/10.1.1/BC-AppGuide_FR.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/bc/10.1.1/BC-ContactMgmtGuide_FR.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/bc/10.0.2/BC-AppGuide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/bc/10.0.2/ConfigGuide.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/bc/10.0.2/ContactMgmtGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/bc/10.0.2/InstallGuide.pdf',
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/bc/10.0.2/RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/bc/10.0.0/fr-BC-AppGuide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/bc/10.0.0/fr-BC-ConfigGuide.pdf',
        },
        {
          label: 'Guide de gestion des contacts',
          url: '/l10n/fr-FR/bc/10.0.0/fr-BC-ContactMgmtGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/bc/10.0.0/fr-BC-InstallGuide.pdf',
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/bc/10.0.0/fr-BC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
