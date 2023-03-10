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
  selector: undefined,

  cards: [
    {
      label: '11.4.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE admin&security-guide.pdf',
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE Developers-guide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE Installer-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ve/11.4.1/de-DE-Digital v.11.4.1 VE_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ve/11.1/de-VE-11.1_onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/ve/10.0.1/de-VE_admin-and-security-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ve/10.0.1/de-VE_AppGuide_de.pdf',
        },
        {
          label: 'Live Style Guide Installation and Configuration Guide',
          url: '/l10n/de-DE/ve/10.0.1/de-VE_Life Style Guide Install and Config.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ve/10.0.1/de-VM_InstallGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
