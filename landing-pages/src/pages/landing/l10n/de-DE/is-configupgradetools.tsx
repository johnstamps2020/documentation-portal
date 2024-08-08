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
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '5.2.0',
      items: [
        {
          label: 'InsuranceSuite-Konfigurationsupgrade​-Tools',
          docId: 'isconfigupgradetools520deDE',
        },
      ],
    },
    {
      label: '5.0.0',
      items: [
        {
          label: 'InsuranceSuite-Konfigurationsupgrade​-Tools',
          docId: 'isconfigupgradetoolsdeDE500',
        },
      ],
    },
  ],
};

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
