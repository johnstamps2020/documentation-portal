import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  cards: [
    {
      label: '2021.04',
      items: [
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/ja-JP/pc/2021.04/PC_CL202104_ja-JP_GosuRefGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/pc/2021.04/PC_CL202104_ja-JP_RulesGuide.pdf',
        },
        {
          label: 'テストガイド',
          url: '/l10n/ja-JP/pc/2021.04/PC_CL202104_ja-JP_TestingGuide.pdf',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Advanced Product Designer ガイド',
          url: '/l10n/ja-JP/pc/2020.11/Cloud202011_ja-JP_AdvancedProductDesigner.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/pc/2020.11/PCCloud202011_ja-JP_ConfigGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pc/2020.11/PCCloud202011_ja-JP_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/pc/2020.05/IS_CL202005-PC-AppGuide-ja_JP.pdf',
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/ja-JP/pc/2020.05/IS_CL202005-PC-ContactMgmtGuide-ja_JP.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pc/10.1.1/PC1011_ja-JP_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'システム管理ガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-AdminGuide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-AppGuide.pdf',
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-BestPracticesGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-ConfigGuide.pdf',
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-ContactMgmtGuide.pdf',
        },
        {
          label: 'PolicyCenter  用語集',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-Glossary.pdf',
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-GosuRefGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-InstallGuide.pdf',
        },
        {
          label: '連携ガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-IntegrationGuide.pdf',
        },
        {
          label: 'Product Designer ガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-ProductDesignerGuide.pdf',
        },
        {
          label: '保険商品モデルガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-ProductModelGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/pc/10.0.2/ja-PC-RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-AppGuide.pdf',
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-BestPracticesGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-ConfigGuide.pdf',
        },
        {
          label: '連絡先管理ガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-ContactMgmtGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-InstallGuide.pdf',
        },
        {
          label: '連携ガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-IntegrationGuide.pdf',
        },
        {
          label: 'Product Designer ガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-ProductDesignerGuide.pdf',
        },
        {
          label: '保険商品モデルガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-ProductModelGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/pc/10.0.0/ja-PC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}