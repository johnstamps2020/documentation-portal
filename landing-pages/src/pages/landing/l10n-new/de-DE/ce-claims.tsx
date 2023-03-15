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
          url: '/l10n/de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims admin&security-guide.pdf',
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims Developers-guide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims Installer-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/ce-claims/11.4.1/de-DE-Digital v.11.4.1 CE-AM Claims_AppGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
