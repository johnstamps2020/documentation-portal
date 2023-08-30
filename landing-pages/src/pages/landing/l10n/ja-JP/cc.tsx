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
    selectedItemLabel: 'ClaimCenter',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.02-IPJ Japan Package',
      items: [
        {
          label:
            'ClaimCenter Package for Japan for Guidewire Cloud リリースノート',
          url: '/l10n/pdfs/ja-JP/cc/2023.02-IPJ Japan Package/IPJReleaseNotes.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2023.02-IPJ Japan Package/IPJApplicationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2023.02-IPJ Japan Package/IPJConfigurationGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2023.02 Garmisch',
      items: [
        {
          label: 'Guidewire Cloud Platform latest Integration Gateway',
          url: '/l10n/pdfs/ja-JP/cc/2023.02 Garmisch/IntegrationGatewayForDevelopers_JA.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.09 Flaine',
      items: [
        {
          label: 'プラグイン、ビルド済み連携、SOAP API',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/IntegrationGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud API ContactManager ガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/CloudAPIGuide-ContactManager_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'ClaimCenter Cloud API ドキュメント（Flaine）リリースノート',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/ReleaseNotes-CC-CloudAPI-Documents-ja.html.pdf',
          videoIcon: false,
        },
        {
          label: 'REST API クライアントガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/RESTAPIClientGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud API 認証ガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/CloudAPIGuide-Auth_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'ClaimCenter Cloud API リファレンス（Flaine）リリースノート',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/ReleaseNotes-CC-CloudAPI-Reference-ja.html.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud API ビジネスフローとコンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/CloudAPIGuide-BusinessFlows_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Integration Gateway',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/IntegrationGatewayForDevelopers_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'REST API フレームワーク',
          url: '/l10n/pdfs/ja-JP/cc/2022.09 Flaine/RESTAPIFramework_ja-JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.05 Elysian',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-CC-2022.05-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud 連携の概要',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-CC-2022.05-OverviewCloudIntegration.pdf',
          videoIcon: false,
        },
        {
          label: '用語集',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-Glossary.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-CC-2022.05-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-CC-2022.05-GosuRefGuide-JA-Final.pdf',
          videoIcon: false,
        },
        {
          label: '開発者設定ガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-CC-2022.05-DeveloperSetupGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu ルール',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/ja-JP-CC-2022.05-GosuRules.pdf',
          videoIcon: false,
        },
        {
          label: 'データアーカイブ',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/DataArchiving-ja.pdf',
          videoIcon: false,
        },
        {
          label: 'グローバリゼーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/GlobalizationGuide-ja.pdf',
          videoIcon: false,
        },
        {
          label: 'リリースノート',
          url: '/l10n/pdfs/ja-JP/cc/2022.05 Elysian/CC_ReleaseNotes_ja-JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.04 Cortina',
      items: [
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/cc/2021.04 Cortina/CC_CL202104_ja-JP_GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'テストガイド',
          url: '/l10n/pdfs/ja-JP/cc/2021.04 Cortina/CC_CL202104_ja-JP_TestingGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/cc/2021.04 Cortina/CC_CL202104_ja-JP_RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11 Banff',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2020.11 Banff/CCCloud202011_ja-JP_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/cc/2020.11 Banff/CCCloud202011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05 Aspen',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/2020.05 Aspen/IS_CL202005-CC-AppGuide-ja_JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/cc/2020.05 Aspen/IS_CL202005-CC-ContactMgmtGuide-ja_JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.1.1/CC1011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: '連携ガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'システム管理ガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.2/ja-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: '連携ガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'システム管理ガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連絡先管理ガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          url: '/l10n/pdfs/ja-JP/cc/10.0.0/ja-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
