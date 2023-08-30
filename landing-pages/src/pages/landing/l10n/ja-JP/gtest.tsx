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
    selectedItemLabel: 'Guidewire Testing',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'UI テスト',
          url: '/l10n/pdfs/ja-JP/gtest/2022.05/GT-UI-JA.pdf',
          videoIcon: false,
        },
        {
          label: 'リリースノート',
          url: '/l10n/pdfs/ja-JP/gtest/2022.05/Guidewire_Test_Automation202205_ReleaseNotes_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire API テスト',
          url: '/l10n/pdfs/ja-JP/gtest/2022.05/GT-API-JA.pdf',
          videoIcon: false,
        },
        {
          label: 'InsuranceSuite ユニットテスト',
          url: '/l10n/pdfs/ja-JP/gtest/2022.05/ISUnitTesting-JA.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gtest() {
  return <CategoryLayout {...pageConfig} />;
}
