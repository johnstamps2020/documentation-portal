import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  cards: [
    {
      label: '11.4.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE admin&security-guide.pdf',
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE Developers-guide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE Installer-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pe/11.4.1/de-DE-Digital v.11.4.1 PE_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pe/11.1/de-PE-cloud_InstallGuide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pe/11.1/de-PE-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/pe/10.0.1/de-PE_admin-and-security-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pe/10.0.1/de-PE_AppGuide.pdf',
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/pe/10.0.1/de-PE_ConfigurationGuide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pe/10.0.1/de-PE_InstallGuide.pdf',
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          url: '/l10n/de-DE/pe/10.0.1/de-PE_Life Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}