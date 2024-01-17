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
    selectedItemLabel: 'ProducerEngage for ClaimCenter',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: 'Versionshinweise', 
docId: 'dx202310deDEpeclaimsrelnotes', 
}, {
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
          docId: 'dx202306deDEpeclaimsrelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe-claims/2023.02/ProducerEngage_Claims_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'dx202302deDEpeclaimsapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe-claims/2021.11/de-DE Digital v.2021.11  PE Claims_AppGuide.pdf',
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
            'de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims Developers-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims Installer-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Peclaims() {
  return <CategoryLayout {...pageConfig} />;
}

