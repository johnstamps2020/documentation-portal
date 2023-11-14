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
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]BillingCenter Release Notes', 
docId: 'isbc202310deDEreleasenotes', 
}, 
{
label: '[TBD]BillingCenter Update', 
docId: 'isbc202310deDEupdate', 
}, 
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'isbc202306deDEreleasenotes',
        },
        {
          label: 'Upgrade-Handbuch',
          docId: 'isbc202306deDEupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'isbc202302deDEapp',
        },
      ],
    },
    {
      label: '2022.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'isbc202205appdeDE',
        },
        {
          label: 'Konfigurationshandbuch',
          docId: 'isbc202205configdeDE',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Cloud-API-Geschäftsabläufe- und Konfigurationshandbuch',
          docId: 'isbc202111apibfdeDE',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/bc/2020.05/ISCL_202005_de_BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/bc/2020.05/ISCL_202005_de_BC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.2.0',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.2.0/BC-InstallGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'German Documentation (de-DE) Release Notes',
          url: '/l10n/pdfs/de-DE/bc/10.2.0/ReleaseNotes-10.2.0-docs-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.2.0/BC-AppGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.2.0/BC-ContactMgmtGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.2.0/BC-ConfigGuide_de-DE.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.1.1/BC1011_de-DE_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.1.1/BC1011_de-DE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.0.2/de-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.0.2/de-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.0.2/de-BC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.0.0/de-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/bc/10.0.0/de-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}

