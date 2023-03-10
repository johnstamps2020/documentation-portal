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
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims admin&security-guide.pdf',
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims Developers-guide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims Installer-guide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims_AppGuide.pdf',
        },
      ],
    },
  ],
};

export default function Peclaims() {
  return <CategoryLayout {...pageConfig} />;
}
