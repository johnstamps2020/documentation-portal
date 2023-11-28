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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]ClaimCenter Release Notes', 
docId: 'iscc202310deDEreleasenotes', 
}, 
{
label: '[TBD]ClaimCenter Update', 
docId: 'iscc202310deDEupdate', 
}, 
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'iscc202306deDEreleasenotes',
        },
        {
          label: 'Upgrade-Handbuch',
          docId: 'iscc202306deDEupdate',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'iscc202302deDEapp',
        },
      ],
    },
    {
      label: '2022.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'iscc202205appdeDE',
        },
        {
          label: 'Konfigurationshandbuch',
          docId: 'iscc202205configdeDE',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Cloud-API-Authentifizierungshandbuch',
          docId: 'iscc202111apicadeDE',
        },
        {
          label: 'Cloud-API-Geschäftsabläufe- und Konfigurationshandbuch',
          docId: 'iscc202111apibfdeDE',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/cc/2020.05/ISCL_202005_de_CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/cc/2020.05/ISCL_202005_de_CC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.2.0',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.2.0/CC-InstallGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'German Documentation (de-DE) Release Notes',
          url: '/l10n/pdfs/de-DE/cc/10.2.0/ReleaseNotes-10.2.0-docs-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.2.0/CC-ConfigGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.2.0/CC-ContactMgmtGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.2.0/CC-AppGuide_de-DE.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.1.1/CC1011_de-DE_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.1.1/CC1011_de-DE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Regelhandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.0.2/de-CC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.0.2/de-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.0.2/de-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.0.0/de-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/cc/10.0.0/de-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}

