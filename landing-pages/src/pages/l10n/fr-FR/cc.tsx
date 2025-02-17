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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: "Guide de l'application",
          docId: 'iscc202407frFRapp',
        },
        {
          label: 'ClaimCenter - Guide de mise à jour',
          docId: 'iscc202407frFRupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: "Guide de l'application",
          docId: 'iscc202402frFRapp',
        },
        {
          label: 'ClaimCenter - Guide de mise à jour',
          docId: 'iscc202402frFRupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: "Claimcenter - Guide de l'application",
          docId: 'iscc202310frFRapp',
        },
        {
          label: 'ClaimCenter - Notes de version',
          docId: 'iscc202310frFRreleasenotes',
        },
        {
          label: 'ClaimCenter - Guide de mise à jour',
          docId: 'iscc202310frFRupdate',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'iscc202306frFRreleasenotes',
        },
        {
          label: 'Guide de mise à niveau',
          docId: 'iscc202306frFRupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'iscc202302frFRapp',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/cc/2021.11/CC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2021.11/ReleaseNotes-2021.11-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2021.11/CC-AppGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'authentification de l'API Cloud",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/cc/2021.11/CC v.2021.11 fr-FR CloudAPIGuide-Auth.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2021.11/CC-ConfigGuide_FR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2020.11/CC_CL202011_fr-FR_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2020.11/CC_CL202011_fr-FR_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2020.05/ISCL_202005_fr_CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/2020.05/ISCL_202005_fr_CC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.2.0',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.2.0/CC-AppGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.2.0/CC-ConfigGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.2.0/CC-ContactMgmtGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.2.0/ReleaseNotes-10.2.0-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.2.0/CC-InstallGuide_fr-FR.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.1.1/CC-AppGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.1.1/CC-ContactMgmtGuide_FR.pdf',
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
          pathInDoc: 'fr-FR/cc/10.0.2/InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.2/RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.2/CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.2/ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.2/ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guide de gestion des contacts',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.0/fr-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.0/fr-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.0/fr-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.0/fr-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cc/10.0.0/fr-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/fr-FR/cc')({
  component: Cc,
});

function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
