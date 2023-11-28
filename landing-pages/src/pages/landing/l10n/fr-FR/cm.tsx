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
    selectedItemLabel: 'InsuranceSuite Contact Management',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'French Documentation (fr-FR) Release Notes',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cm/2021.11/ReleaseNotes-2021.11-docs-fr.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide des personnes-ressources de Guidewire',
          docId: 'l10npdfss3folder',
          pathInDoc: 'fr-FR/cm/2021.11/ContactMgmtGuide_FR.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
