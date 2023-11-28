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
    selectedItemLabel: 'CustomerEngage Account Management',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202306frFRceamrelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRceamapp',
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
            'fr-FR/ce-am/2021.11/fr-FR Digital v.2021.11 CE-AM_AppGuide.pdf',
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
          pathInDoc:
            'fr-FR/ce-am/11.4.1/fr-FR Digital v.11.4.1 CE-AM AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-am/11.4.1/fr-FR Digital v.11.4.1 CE-AM InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-am/11.4.1/fr-FR-Digital v.11.4.1 CE-AM admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-am/11.4.1/fr-FR-Digital v.11.4.1 CE-AM DevelopersGuide.pdf',
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
          pathInDoc: 'fr-FR/ce-am/11.1/fr-CE_AM-onprem_InstallGuide.pdf',
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
          pathInDoc: 'fr-FR/ce-am/10.0.1/fr-CE_AM_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-am/10.0.1/fr-CE_AM_Life_Style_Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ce-am/10.0.1/fr-CE_AM_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ce-am/10.0.1/fr-CE_AM_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des applications',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/ce-am/10.0.1/fr-CE_AM__AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
