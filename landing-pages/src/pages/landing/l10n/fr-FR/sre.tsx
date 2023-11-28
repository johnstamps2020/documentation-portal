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
    selectedItemLabel: 'ServiceRepEngage',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]SRE Release Notes', 
docId: 'dx202310frFRsrerelnotes', 
}, 
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202306frFRsrerelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRsreapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/sre/2021.11/fr-FR Digital v.2021.11 SRE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/sre/11.4.1/fr-FR Digital v.11.4.1 SRE AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/sre/11.4.1/fr-FR-Digital v.11.4.1 SRE InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/sre/11.4.1/fr-FR-Digital v.11.4.1 SRE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/sre/11.4.1/fr-FR-Digital v.11.4.1 SRE-DevelopersGuide.pdf',
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
          pathInDoc: 'fr-FR/sre/11.1/fr-SRE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/sre/10.0.1/fr-SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/sre/10.0.1/fr-SRE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/sre/10.0.1/fr-SRE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des applications',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/sre/10.0.1/fr-SRE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/sre/10.0.1/fr-SRE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}

