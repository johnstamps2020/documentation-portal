import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Choisissez un produit',
    selectedItemLabel: 'CustomerEngage Account Management for ClaimCenter',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202306frFRceclaimsrelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRceclaimsapp',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-claims/2021.11/fr-FR Digital v.2021.11 CE-AM Claims_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-claims/11.4.1/fr-FR-Digital v.11.4.1 CE-AM - Claims admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-claims/11.4.1/fr-FR-Digital v,11.4.1 CE-AM Claims Developers Guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-claims/11.4.1/fr-FR Digital v.11.4.1 CE-AM  CE-AM Claims InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/ce-claims/11.4.1/Fr-FR Digital v.11.4.1 CE-AM-Claims AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
