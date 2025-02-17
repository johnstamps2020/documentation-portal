import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Produkt auswählen',
    selectedItemLabel: 'CustomerEngage Account Management for ClaimCenter',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'dx202407deDEceclaimsrelnotes',
        },
        {
          label: 'EnterpriseEngage - Update-Handbuch',
          docId: 'ee202407deDEupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'dx202402deDEceclaimsrelnotes',
        },
        {
          label: 'EnterpriseEngage - Update-Handbuch',
          docId: 'ee202402deDEupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'dx202310deDEceclaimsrelnotes',
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
          docId: 'dx202306deDEceclaimsrelnotes',
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
            'de-DE/ce-claims/2023.02/CustomerEngage_Claims_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'dx202302deDEceclaimsapp',
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
            'de-DE/ce-claims/2021.11/de-DE Digital v.2021.11 CE-AM Claims_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims Installer-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims Developers-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrator- und Sicherheitshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims admin&security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/de-DE/ce-claims')({
  component: Ceclaims,
});

function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
