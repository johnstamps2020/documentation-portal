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
    label: 'Selecione o produto',
    selectedItemLabel: 'InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '5.1.0',
      items: [
        {
          label: 'InsuranceSuite Configuration Upgrade Tools Guide',
          docId: 'isconfigupgradetools510ptBR',
        },
      ],
    },
    {
    label: '5.0.0',
    items: [
      {
        label: 'InsuranceSuite Configuration Upgrade Tools Guide',
        docId: 'isconfigupgradetoolsptBR500',
      },
    ],
  },
  ],
};

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}