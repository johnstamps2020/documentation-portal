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
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pe/11.1/ja-PE-cloud_InstallGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pe/11.1/ja-PE-onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/ja-JP/pe/10.0.1/ja-PE_Admin and Security Guide_Japanese_1001.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/pe/10.0.1/ja-PE_AppGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/pe/10.0.1/ja-PE_ConfigurationGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/pe/10.0.1/ja-PE_InstallGuide.pdf',
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/ja-JP/pe/10.0.1/ja-SRE_Live Style Guide Install and Config.pdf.pdf',
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
