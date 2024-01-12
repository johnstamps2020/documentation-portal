import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Choisissez un produit',
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: 'BillingCenter - Notes de version', 
docId: 'isbc202310frFRreleasenotes', 
}, 
{
label: 'BillingCenter - Guide de mise à jour', 
docId: 'isbc202310frFRupdate', 
}, 
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'isbc202306frFRreleasenotes',
        },
        {
          label: 'Guide de mise à niveau',
          docId: 'isbc202306frFRupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'isbc202302frFRapp',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/2021.11/BC-AppGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label:
            "Guide de configuration et de flux opérationnels de l'API Cloud",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/bc/2021.11/BC v.2021.11 fr-FR CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/2021.11/ReleaseNotes-2021.11-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/2021.11/BC-ConfigGuide_FR.pdf',
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
          pathInDoc: 'fr-FR/bc/2020.11/BC_CL202011_fr-FR_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/2020.11/BC_CL202011_fr-FR_ConfigGuide.pdf',
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
          pathInDoc: 'fr-FR/bc/2020.05/ISCL_202005_fr_BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/2020.05/ISCL_202005_fr_BC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.2.0',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.2.0/BC-InstallGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.2.0/BC-ContactMgmtGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.2.0/BC-AppGuide_fr-FR.pdf',
          videoIcon: false,
        },
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.2.0/ReleaseNotes-10.2.0-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.2.0/BC-ConfigGuide_fr-FR.pdf',
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
          pathInDoc: 'fr-FR/bc/10.1.1/BC-AppGuide_FR.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.1.1/BC-ContactMgmtGuide_FR.pdf',
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
          pathInDoc: 'fr-FR/bc/10.0.2/InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.2/RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.2/BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.2/ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.2/ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.0/fr-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.0/fr-BC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des règles',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.0/fr-BC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de gestion des contacts',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.0/fr-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/bc/10.0.0/fr-BC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}

