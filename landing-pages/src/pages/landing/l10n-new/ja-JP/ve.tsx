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
      label: '2022.05',
      items: [
        {
          label: 'インストールガイド',
          docId: 'dx202205jaJPveinstall',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/ve/11.1/ja-VE-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/ja-JP/ve/10.0.1/ja-VE_Admin and Security Guide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/ve/10.0.1/ja-VE_AppGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/ve/10.0.1/ja-VE_InstallGuide.pdf',
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/ja-JP/ve/10.0.1/ja-VE_Live Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
