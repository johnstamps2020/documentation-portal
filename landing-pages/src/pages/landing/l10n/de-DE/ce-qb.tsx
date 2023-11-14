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
    label: 'Produkt auswählen',
    selectedItemLabel: 'CustomerEngage Quote and Buy',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]CustomerEngage Quote and Buy Release Notes', 
docId: 'dx202310deDEceqbrelnotes', 
}, 
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'dx202306deDEceqbrelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/2023.02/CustomerEngage_QuoteAndBuy_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'dx202302deDEceqbapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/2021.11/de-DE Digital v.2021.11 CE-QB_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB Installer-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB Developers-guide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/11.1/de-CE_QB-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/10.0.1/de-CEQB_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/10.0.1/de-CEQB_AppGuide_guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          url: '/l10n/pdfs/de-DE/ce-qb/10.0.1/de-CEQB_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/10.0.1/de-CEQB_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/pdfs/de-DE/ce-qb/10.0.1/de-CEQB_admin-and-security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}

