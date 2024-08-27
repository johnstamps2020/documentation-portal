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
      label: 'データマスキング',
      items: [
        {
            label: 'データマスキング',
            docId: 'datamaskingjaJP'
        }
      ],
    },
    {
      label: 'Integration Gateway',
      items: [
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatestjaJP',
        },
      ],
    },
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'ClaimCenter アップデート',
          docId: 'iscc202407jaJPupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'ClaimCenter アプリケーションガイド',
          docId: 'iscc202402jaJPapp',
        },
        {
          label: 'ClaimCenter リリースノート',
          docId: 'iscc202402jaJPreleasenotes',
        },
        {
          label: 'ClaimCenter アップデート',
          docId: 'iscc202402jaJPupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'ClaimCenter リリースノート',
          docId: 'iscc202310jaJPreleasenotes',
        },
        {
          label: 'ClaimCenter アップデート',
          docId: 'iscc202310jaJPupdate',
        },
      ],
    },
    {
      label: '2023.06 (Hakuba)',
      items: [
        {
          label: 'リリースノート',
          docId: 'iscc202306jareleasenotes',
          videoIcon: false,
        },
        {
          label: 'アップデート',
          docId: 'iscc202306jaupdate',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2023.02-IPJ Japan Package',
      items: [
        {
          label:
            'ClaimCenter Package for Japan for Guidewire Cloud リリースノート',
          docId: 'iscc202302ipjreleasenotesjaJP',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'iscc202302ipjappjaJP',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          docId: 'iscc202302ipjconfigjaJP',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.09 (Flaine)',
      items: [
        {
          label: 'プラグイン、ビルド済み連携、SOAP API',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/2022.09 Flaine/IntegrationGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud API ContactManager ガイド',
          docId: 'iscc202209apicmjaJP',
        },
        {
          label: 'ClaimCenter Cloud API ドキュメント（Flaine）リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2022.09 Flaine/ReleaseNotes-CC-CloudAPI-Documents-ja.html.pdf',
          videoIcon: false,
        },
        {
          label: 'REST API クライアントガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/2022.09 Flaine/RESTAPIClientGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud API 認証ガイド',
          docId: 'iscc202209cloudapicajaJP',
        },
        {
          label: 'ClaimCenter Cloud API リファレンス（Flaine）リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2022.09 Flaine/ReleaseNotes-CC-CloudAPI-Reference-ja.html.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud API ビジネスフローとコンフィギュレーションガイド',
          docId: 'iscc202209cloudapibfjaJP',
        },
        {
          label: 'REST API フレームワーク',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/2022.09 Flaine/RESTAPIFramework_ja-JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.05 (Elysian)',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          docId: 'iscc202205configjaJP',
        },
        {
          label: 'Cloud 連携の概要',
          docId: 'is202205integoverviewjaJP',
        },
        {
          label: '用語集',
          docId: 'gwglossaryjaJP',
        },
        {
          label: 'アプリケーションガイド',
          docId: 'iscc202205appjaJP',
        },
        {
          label: '開発者設定ガイド',
          docId: 'iscc202205devsetupjaJP',
        },
        {
          label: 'Gosu ルール',
          docId: 'iscc202205rulesjaJP',
        },
        {
          label: 'データアーカイブ',
          docId: 'iscc202205dataarchivingjaJP',
        },
        {
          label: 'グローバリゼーションガイド',
          docId: 'iscc202205globaljaJP',
        },
        {
          label: 'リリースノート',
          docId: 'iscc202205releasenotesjaJP',
        },
      ],
    },
    {
      label: '2021.04 (Cortina)',
      items: [
        {
          label: 'テストガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2021.04 Cortina/CC_CL202104_ja-JP_TestingGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2021.04 Cortina/CC_CL202104_ja-JP_RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11 (Banff)',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2020.11 Banff/CCCloud202011_ja-JP_ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2020.11 Banff/CCCloud202011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05 (Aspen)',
      items: [
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/2020.05 Aspen/IS_CL202005-CC-AppGuide-ja_JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cc/2020.05 Aspen/IS_CL202005-CC-ContactMgmtGuide-ja_JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.1.1/CC1011_ja-JP_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: '連携ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'システム管理ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.2/ja-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: '連携ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-IntegrationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'システム管理ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: '連絡先管理ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Gosu リファレンスガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-GosuRefGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ベストプラクティスガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-BestPracticesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'ルールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cc/10.0.0/ja-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
