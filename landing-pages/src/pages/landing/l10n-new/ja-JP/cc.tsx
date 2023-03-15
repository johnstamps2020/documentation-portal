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
      label: '2022.09',
      items: [
        {
          label: 'Cloud API 認証ガイド',
          docId: 'iscc202209cloudapicajaJP',
        },
        {
          label: 'Cloud API ビジネスフローとコンフィギュレーションガイド',
          docId: 'iscc202209cloudapibfjaJP',
        },
        {
          label: 'Cloud API ContactManager ガイド',
          docId: 'iscc202209apicmjaJP',
        },
      ],
    },
    {
      label: '2022.05',
      items: [
        {
          label: 'システム管理ガイド',
          docId: 'iscc202205adminjaJP',
        },
        {
          label: '開発者設定ガイド',
          docId: 'iscc202205devsetupjaJP',
        },
        {
          label: 'Cloud 連携の概要',
          docId: 'is202205integoverviewjaJP',
        },
        {
          label: 'アプリケーションガイド',
          docId: 'iscc202205appjaJP',
        },
        {
          label: 'コンフィギュレーションガイド',
          docId: 'iscc202205configjaJP',
        },
        {
          label: 'Gosu リファレンスガイド',
          docId: 'gosureflatestjaJP',
        },
        {
          label: 'Gosu ルール',
          docId: 'iscc202205rulesjaJP',
        },
        {
          label: 'Guidewire データアーカイブ',
          docId: 'iscc202205dataarchivingjaJP',
        },
        {
          label: 'Gosu ルールガイド',
          docId: 'iscc202205globaljaJP',
        },
        {
          label: '用語集',
          docId: 'gwglossaryjaJP',
        },
      ],
    },
    {
      label: '2021.04',
      items: [
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/ja-JP/cc/2021.04/CC_CL202104_ja-JP_GosuRefGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/cc/2021.04/CC_CL202104_ja-JP_RulesGuide.pdf',
        },
        {
          label: 'テストガイド',
          url: '/l10n/ja-JP/cc/2021.04/CC_CL202104_ja-JP_TestingGuide.pdf',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/cc/2020.11/CCCloud202011_ja-JP_ConfigGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/cc/2020.11/CCCloud202011_ja-JP_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/cc/2020.05/IS_CL202005-CC-AppGuide-ja_JP.pdf',
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/ja-JP/cc/2020.05/IS_CL202005-CC-ContactMgmtGuide-ja_JP.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/cc/10.1.1/CC1011_ja-JP_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'システム管理ガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-AdminGuide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-AppGuide.pdf',
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-BestPracticesGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-ConfigGuide.pdf',
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-GosuRefGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-InstallGuide.pdf',
        },
        {
          label: '連携ガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-IntegrationGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/cc/10.0.2/ja-CC-RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'システム管理ガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-AdminGuide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-AppGuide.pdf',
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-BestPracticesGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-ConfigGuide.pdf',
        },
        {
          label: '連絡先管理ガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-GosuRefGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-InstallGuide.pdf',
        },
        {
          label: '連携ガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-IntegrationGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/cc/10.0.0/ja-CC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
