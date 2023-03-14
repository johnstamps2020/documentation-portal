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
          label: "Guide d'authentification de l'API Cloud",
          url: '/l10n/fr-FR/pc/2021.11/PC v.2021.11 fr-FR CloudAPIGuide-Auth.pdf',
        },
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          url: '/l10n/fr-FR/pc/2021.11/PC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guide Advanced Product Designer',
          url: '/l10n/fr-FR/pc/2020.11/PC_CL202011_fr-FR_AdvancedProductDesigner.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/pc/2020.11/PC_CL202011_fr-FR_ConfigGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pc/2020.11/PC_CL202011_fr-FR_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/pc/2020.05/ISCL_202005_fr_PC-AppGuide.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/pc/2020.05/ISCL_202005_fr_PC_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guide Advanced Product Designer',
          url: '/l10n/fr-FR/pc/10.1.1/AdvancedProductDesigner_FR.pdf',
        },
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/pc/10.1.1/PC-AppGuide_FR.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/pc/10.1.1/PC-ContactMgmtGuide_FR.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/pc/10.0.2/ConfigGuide.pdf',
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          url: '/l10n/fr-FR/pc/10.0.2/ContactMgmtGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pc/10.0.2/InstallGuide.pdf',
        },
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/pc/10.0.2/PC-AppGuide.pdf',
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/pc/10.0.2/RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/pc/10.0.0/fr-PC-AppGuide.pdf',
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/fr-FR/pc/10.0.0/fr-PC-ConfigGuide.pdf',
        },
        {
          label: 'Guide de gestion des contacts',
          url: '/l10n/fr-FR/pc/10.0.0/fr-PC-ContactMgmtGuide.pdf',
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pc/10.0.0/fr-PC-InstallGuide.pdf',
        },
        {
          label: 'Guide des règles',
          url: '/l10n/fr-FR/pc/10.0.0/fr-PC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
