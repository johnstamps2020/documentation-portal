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
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.10 (Innsbruck)', 
      items: [
        {
          label: 'Ferramentas de atualização de configuração do Guidewire InsuranceSuite', 
          docId: 'isconfigupgradetoolsptBR500', 
        }, 
      ]
    }
  ]
};

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}

