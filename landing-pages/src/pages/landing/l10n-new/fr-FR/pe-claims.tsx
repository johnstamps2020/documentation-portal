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
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE Claims admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE Claims DevelopersGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE-Claims AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE-Claims InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Peclaims() {
  return <CategoryLayout {...pageConfig} />;
}
