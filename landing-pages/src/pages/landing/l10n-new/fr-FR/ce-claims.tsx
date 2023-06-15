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
          label: "Guide d'installation",
          url: '/l10n/fr-FR/ce-claims/11.4.1/fr-FR Digital v.11.4.1 CE-AM  CE-AM Claims InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          url: '/l10n/fr-FR/ce-claims/11.4.1/Fr-FR Digital v.11.4.1 CE-AM-Claims AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/fr-FR/ce-claims/11.4.1/fr-FR-Digital v,11.4.1 CE-AM Claims Developers Guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/fr-FR/ce-claims/11.4.1/fr-FR-Digital v.11.4.1 CE-AM - Claims admin&security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
