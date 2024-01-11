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
    selectedItemLabel: 'VendorEngage',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: 'Versionshinweise für VendorEngage', 
docId: 'dx202310deDEverelnotes', 
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
          docId: 'dx202306deDEverelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ve/2023.02/VendorEngage_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'dx202302deDEveapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ve/2021.11/de-DE Digital v.2021.11 VE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE Developers-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrator- und Sicherheitshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE Installer-guide.pdf',
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
          pathInDoc: 'de-DE/ve/11.1/de-VE-11.1_onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ve/10.0.1/de-VE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ve/10.0.1/de-VE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ve/10.0.1/de-VE_AppGuide_de.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ve/10.0.1/de-VM_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}

