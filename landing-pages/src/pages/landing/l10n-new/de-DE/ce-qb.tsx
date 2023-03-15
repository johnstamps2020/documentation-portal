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
          url: '/l10n/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB admin&security-guide.pdf',
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB Developers-guide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB Installer-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ce-qb/11.4.1/de-DE-Digital v.11.4.1 CE-QB_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-qb/11.1/de-CE_QB-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/ce-qb/10.0.1/de-CEQB_admin-and-security-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ce-qb/10.0.1/de-CEQB_AppGuide_guide.pdf',
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/ce-qb/10.0.1/de-CEQB_ConfigurationGuide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-qb/10.0.1/de-CEQB_InstallGuide.pdf',
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          url: '/l10n/de-DE/ce-qb/10.0.1/de-CEQB_Life Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
