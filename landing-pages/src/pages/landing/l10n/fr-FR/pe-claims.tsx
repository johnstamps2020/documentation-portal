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
    selectedItemLabel: 'ProducerEngage for ClaimCenter',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202402frFRpeclaimsrelnotes',
        },
        {
          label: 'Guide de mise à jour',
          docId: 'ee202402frFRupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202310frFRpeclaimsrelnotes',
        },
        {
          label: 'Guide de mise à jour',
          docId: 'ee202310frFRupdate',
        },
      ],
    },
    {
      label: '2023.06',
      items: [
        {
          label: 'Notes sur la version',
          docId: 'dx202306frFRpeclaimsrelnotes',
        },
      ],
    },
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          docId: 'dx202302frFRpeclaimsapp',
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
            'fr-FR/pe-claims/2021.11/fr-FR Digital v.2021.11 PE Claims_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide d'installation",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE-Claims InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE Claims admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE Claims DevelopersGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          docId: 'l10npdfss3folder',
          pathInDoc:
            'fr-FR/pe-claims/11.4.1/fr-FR-Digital v.11.4.1 PE-Claims AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Peclaims() {
  return <CategoryLayout {...pageConfig} />;
}
