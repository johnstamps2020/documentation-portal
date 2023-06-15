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
          label: 'Administrator- und Sicherheitshandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Entwicklerhandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims Developers-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims Installer-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pe-claims/11.4.1/de-DE-Digital v.11.4.1 PE Claims_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Peclaims() {
  return <CategoryLayout {...pageConfig} />;
}
