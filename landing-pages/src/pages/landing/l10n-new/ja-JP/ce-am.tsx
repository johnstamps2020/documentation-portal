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
  selector: undefined,

  cards: [
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/ce-am/11.1/ja-CE-AM-onprem-InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/ja-JP/ce-am/10.0.1/ja-CEAM_Admin and Security Guide..pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/ce-am/10.0.1/ja-CEAM_AppGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/ce-am/10.0.1/ja-CEAM_ConfigurationGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/ce-am/10.0.1/ja-CEAM_InstallGuide.pdf',
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/ja-JP/ce-am/10.0.1/ja-CEAM_Live Style Guide Install and Config.pdf',
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
