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
          url: '/l10n/ja-JP/bc/2021.04/BC_CL202104_ja-JP_GosuRefGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/bc/2021.04/BC_CL202104_ja-JP_RulesGuide.pdf',
        },
        {
          label: 'テストガイド',
          url: '/l10n/ja-JP/bc/2021.04/BC_CL202104_ja-JP_TestingGuide.pdf',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/bc/2020.11/BCCloud202011_ja-JP_ConfigGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/bc/2020.11/BCCloud202011_ja-JP_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/bc/2020.05/IS_CL202005-BC-AppGuide-ja_JP.pdf',
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/ja-JP/bc/2020.05/IS_CL202005-BC-ContactMgmtGuide-ja_JP.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/bc/10.1.1/BC1011_ja-JP_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'システム管理ガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-AdminGuide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-AppGuide.pdf',
        },
        {
          label: 'ベストプラクティスガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-BestPracticesGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-ConfigGuide.pdf',
        },
        {
          label: 'Guidewire 連絡先管理ガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Gosu リファレンスガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-GosuRefGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-InstallGuide.pdf',
        },
        {
          label: '連携ガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-IntegrationGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/bc/10.0.2/ja-BC-RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/bc/10.0.0/ja-BC-AppGuide.pdf',
        },
        {
          label: '連絡先管理ガイド',
          url: '/l10n/ja-JP/bc/10.0.0/ja-BC-ContactMgmtGuide.pdf',
        },
        {
          label: 'ルールガイド',
          url: '/l10n/ja-JP/bc/10.0.0/ja-BC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}