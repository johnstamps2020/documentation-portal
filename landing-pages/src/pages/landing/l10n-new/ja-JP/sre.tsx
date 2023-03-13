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
      label: '2022.05',
      items: [
        {
          label: 'インストールガイド',
          docId: 'dx202205jaJPsreinstall',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/sre/11.1/ja-SRE onprem_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/ja-JP/sre/10.0.1/ja-SRE_Admin and Security Guide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/sre/10.0.1/ja-SRE_AppGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/sre/10.0.1/ja-SRE_ConfigurationGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/sre/10.0.1/ja-SRE_InstallGuide.pdf',
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/ja-JP/sre/10.0.1/ja-SRE_Live Style Guide Install and Config.pdf.pdf',
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
