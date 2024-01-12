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
    label: 'Produkt auswählen',
    selectedItemLabel: 'InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.10 (Innsbruck)', 
      items: [
        {
          label: 'InsuranceSuite Configuraiton Upgrade Guide', 
          docId: 'isconfigupgradetoolsdeDE500', 
        }, 
      ]
    }
  ]
};

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}

