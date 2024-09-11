import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Choisissez un produit',
    selectedItemLabel: 'PolicyCenter',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: "Guide de l'application",
          docId: 'ispc202407frFRapp',
        },
        {
          label: 'PolicyCenter - Guide de mise à jour',
          docId: 'ispc202407frFRupdate',
        },
        {
          label: "Product Designer",
          docId: 'ispc202407frFRpd',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: "Guide de l'application",
          docId: 'ispc202402frFRapp',
        },
        {
          label: 'PolicyCenter - Notes de version',
          docId: 'ispc202402frFRreleasenotes',
        },
        {
          label: 'PolicyCenter - Guide de mise à jour',
          docId: 'ispc202402frFRupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: "PolicyCenter - Guide de l'application",
          docId: 'ispc202310frFRapp',
        },
        {
          label: 'PolicyCenter - Notes de version',
          docId: 'ispc202310frFRreleasenotes',
        },
        {
          label: 'PolicyCenter - Guide de mise à jour',
          docId: 'ispc202310frFRupdate',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'ispc202306frFRreleasenotes',
        },
        {
          label: 'Guide de mise à niveau',
          docId: 'ispc202306frFRupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'ispc202302frFRapp',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2021.11/ReleaseNotes-2021.11-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2021.11/PC-ConfigGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pc/2021.11/PC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2021.11/PC-AppGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'authentification de l'API Cloud",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pc/2021.11/PC v.2021.11 fr-FR CloudAPIGuide-Auth.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide Advanced Product Designer pour PolicyCenter',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2021.11/AdvancedProductDesigner_FR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2020.11/PC_CL202011_fr-FR_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pc/2020.11/PC_CL202011_fr-FR_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2020.11/PC_CL202011_fr-FR_ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2020.05/ISCL_202005_fr_PC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/2020.05/ISCL_202005_fr_PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.2.0',
      items: [
        {
          label: 'Guide Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.2.0/AdvancedProductDesigner_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.2.0/PC-ContactMgmtGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.2.0/PC-ConfigGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.2.0/PC-AppGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.2.0/ReleaseNotes-10.2.0-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.2.0/PC-InstallGuide_fr-FR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.1.1/PC-ContactMgmtGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.1.1/PC-AppGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide Advanced Product Designer',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.1.1/AdvancedProductDesigner_FR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.2/InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.2/RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.2/PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.2/ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.2/ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.0/fr-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.0/fr-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.0/fr-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de gestion des contacts',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.0/fr-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/pc/10.0.0/fr-PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/fr-FR/pc')({
  component: Pc,
});

function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
