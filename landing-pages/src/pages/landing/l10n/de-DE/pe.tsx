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
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: 'Versionshinweise für ProducerEngage', 
docId: 'dx202310deDEperelnotes', 
}, 
{
  label: 'EnterpriseEngage - Update-Handbuch',
  docId: 'ee202310deDEupdate',
},
],
},
{
      label: '2023.06',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'dx202306deDEperelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/2023.02/ProducerEngage_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'dx202302deDEpeapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/2021.11/de-DE Digital v.2021.11 PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE Developers-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE Installer-guide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/11.1/de-PE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/11.1/de-PE-cloud_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/10.0.1/de-PE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/10.0.1/de-PE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/10.0.1/de-PE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe/10.0.1/de-PE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrator- und Sicherheitshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/pe/10.0.1/de-PE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}

