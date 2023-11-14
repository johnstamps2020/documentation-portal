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
    selectedItemLabel: 'CustomerEngage Quote and Buy',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]CustomerEngage Quote and Buy Release Notes', 
docId: 'dx202310frFRceqbrelnotes', 
}, 
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202306frFRceqbrelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRceqbapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/pdfs/fr-FR/ce-qb/2021.11/fr-FR Digital v.2021.11 CE-QB_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: 'Guide du développeur',
          url: '/l10n/pdfs/fr-FR/ce-qb/11.4.1/fr-FR-Digital v.11.4.1 CE-QB Developers Guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          url: '/l10n/pdfs/fr-FR/ce-qb/11.4.1/fr-FR Digital v.11.4.1 CE-QB AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/ce-qb/11.4.1/fr-FR-Digital v.11.4.1 CE-QB InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/pdfs/fr-FR/ce-qb/11.4.1/fr-FR-Digital v.11.4.1 CE-QB admin&security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/ce-qb/11.1/fr-CE_QB-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guide des applications',
          url: '/l10n/pdfs/fr-FR/ce-qb/10.0.1/fr-CE_QB_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/pdfs/fr-FR/ce-qb/10.0.1/fr-CE_QB_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/pdfs/fr-FR/ce-qb/10.0.1/fr-CE_QA_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/pdfs/fr-FR/ce-qb/10.0.1/fr-CE_QB_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/ce-qb/10.0.1/fr-CE_QB_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}

