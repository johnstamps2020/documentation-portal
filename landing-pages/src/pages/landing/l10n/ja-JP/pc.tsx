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
    selectedItemLabel: 'PolicyCenter',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '',
      items: [
        {
          label: 'Gosu リファレンスガイド',
          docId: 'gosureflatestjaJP',
        },
      ],
    },
    {
      label: '',
      items: [
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatestjaJP',
        },
      ],
    },
    {
      label: '2021.04 Cortina',
      items: [
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/pc/2021.04 Cortina/PC_CL202104_ja-JP_RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'テストガイド',
          url: '/l10n/pdfs/ja-JP/pc/2021.04 Cortina/PC_CL202104_ja-JP_TestingGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11 Banff',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pc/2020.11 Banff/PCCloud202011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Advanced Product Designer ガイド',
          url: '/l10n/pdfs/ja-JP/pc/2020.11 Banff/Cloud202011_ja-JP_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/pc/2020.11 Banff/PCCloud202011_ja-JP_ConfigGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05 Aspen',
      items: [
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/pc/2020.05 Aspen/IS_CL202005-PC-ContactMgmtGuide-ja_JP.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/pc/2020.05 Aspen/IS_CL202005-PC-AppGuide-ja_JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.1.1/PC1011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: '保険商品モデルガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-ProductModelGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'システム管理ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連携ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'PolicyCenter  用語集',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-Glossary.pdf',
          videoIcon: false,
        },
        {
          label: 'Product Designer ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-ProductDesignerGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.2/ja-PC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: '保険商品モデルガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-ProductModelGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連携ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Product Designer ガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-ProductDesignerGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/pdfs/ja-JP/pc/10.0.0/ja-PC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
