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
    selectedItemLabel: 'BillingCenter',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.04 Cortina',
      items: [
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/bc/2021.04 Cortina/BC_CL202104_ja-JP_GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'テストガイド',
          url: '/l10n/pdfs/ja-JP/bc/2021.04 Cortina/BC_CL202104_ja-JP_TestingGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/bc/2021.04 Cortina/BC_CL202104_ja-JP_RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11 Banff',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/bc/2020.11 Banff/BCCloud202011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/bc/2020.11 Banff/BCCloud202011_ja-JP_ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05 Aspen',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/bc/2020.05 Aspen/IS_CL202005-BC-AppGuide-ja_JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/bc/2020.05 Aspen/IS_CL202005-BC-ContactMgmtGuide-ja_JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.1.1/BC1011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連携ガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'システム管理ガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.2/ja-BC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.0/ja-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.0/ja-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/bc/10.0.0/ja-BC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
