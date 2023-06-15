import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '11.4.1',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-am/11.4.1/de-DE-Digital v.11.4.1 CE-AM Installer-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ce-am/11.4.1/de-DE-Digital v.11.4.1 CE-AM_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/ce-am/11.4.1/de-DE-Digital v.11.4.1 CEAM Developers-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/ce-am/11.4.1/de-DE-Digital v11.4.1 CE-AM admin&security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-am/11.1/de-CE-AM-11.1_onprem_InstallGuides.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/ce-am/10.0.1/de-CEAM_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ce-am/10.0.1/de-CEAM_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/ce-am/10.0.1/de-CEAM_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-am/10.0.1/de-CEAM_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          url: '/l10n/de-DE/ce-am/10.0.1/de-CEAM_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
