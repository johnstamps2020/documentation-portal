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
    selectedItemLabel: 'CustomerEngage Account Management',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'Versionshinweise',
          docId: 'dx202407deDEceamrelnotes',
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
          docId: 'dx202402deDEceamrelnotes',
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
          docId: 'dx202310deDEceamrelnotes',
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
          docId: 'dx202306deDEceamrelnotes',
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
            'de-DE/ce-am/2023.02/CustomerEngage_AccountManagement_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'dx202302deDEceamapp',
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
            'de-DE/ce-am/2021.11/de-DE Digital v.2021.11 CE-AM_AppGuide.pdf',
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
            'de-DE/ce-am/11.4.1/de-DE-Digital v11.4.1 CE-AM admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-am/11.4.1/de-DE-Digital v.11.4.1 CE-AM Installer-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-am/11.4.1/de-DE-Digital v.11.4.1 CE-AM_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-am/11.4.1/de-DE-Digital v.11.4.1 CEAM Developers-guide.pdf',
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
          pathInDoc: 'de-DE/ce-am/11.1/de-CE-AM-11.1_onprem_InstallGuides.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Konfigurationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ce-am/10.0.1/de-CEAM_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'de-DE/ce-am/10.0.1/de-CEAM_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ce-am/10.0.1/de-CEAM_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrator- und Sicherheitshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ce-am/10.0.1/de-CEAM_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          docId: 'l10npdfss3folder',
          pathInDoc: 'de-DE/ce-am/10.0.1/de-CEAM_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/de-DE/ce-am')({
  component: Ceam,
});

function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
