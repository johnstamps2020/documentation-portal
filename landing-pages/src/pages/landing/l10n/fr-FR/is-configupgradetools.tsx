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
    selectedItemLabel: 'InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '5.1.0',
      items: [
        {
          label: 'Guide des outils de mise à niveau de la configuration',
          docId: 'isconfigupgradetools510frFR',
        },
      ],
    },
    {
    label: '5.0.0',
    items: [
      {
        label: 'Guide des outils de mise à niveau de la configuration',
        docId: 'isconfigupgradetoolsfrFR500',
      },
    ],
  },
  ],
};

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
