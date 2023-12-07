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
    selectedItemLabel: '[TBD]InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
    label: '2023.10 (Innsbruck)', 
    items: [
    {
    label: '[TBD]InsuranceSuite Configuraiton Upgrade Guide', 
    docId: 'isconfigupgradetoolsfrFR500', 
    }, 
    ],
    },
  ]
};

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
