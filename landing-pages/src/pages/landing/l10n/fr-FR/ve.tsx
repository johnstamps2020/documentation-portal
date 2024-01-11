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
    selectedItemLabel: 'VendorEngage',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: 'VendorEngage - Notes de version', 
docId: 'dx202310frFRverelnotes', 
}, 
{
  label: 'EnterpriseEngage - Guide de mise à jour',
  docId: 'ee202310frFRupdate',
},
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202306frFRverelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRveapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ve/2021.11/fr-FR Digital 2021.11 VE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: 'Guide du développeur',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE-DevelopersGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ve/11.4.1/fr-FR Digital v.11.4.1 VE AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ve/11.4.1/fr-FR-Digital v.11.4.1 VE InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ve/11.1/fr-VE-11.1_onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ve/10.0.1/fr-VE_InstallGuide_fr.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ve/10.0.1/fr-VE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des applications',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ve/10.0.1/fr-VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ve/10.0.1/fr-VE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}

