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
    label: '製品を選択',
    selectedItemLabel: 'Advanced Product Designer',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Advanced Product Designer リリースノート',
          docId: 'apdjaJPapprninnsbruck',
        },
        {
          label: 'APD アプリを使用した保険商品の作成',
          docId: 'apdjaJPcreatingproductsinnsbruck',
        },
        {
          label: 'PolicyCenter を使用した保険商品の連携',
          docId: 'apdjaJPfinalizingproductsinnsbruck',
        },
        {
          label: 'Advanced Product Designer ガイドブック',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/apd/innsbruck/Guidebook_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gtest() {
  return <CategoryLayout {...pageConfig} />;
}
