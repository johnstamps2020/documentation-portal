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
          url: '/l10n/ja-JP/ce-qb/11.1/ja-CE_QB_InstallGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/ja-JP/ce-qb/10.0.1/ja-CEQB_Admin and Security Guide.pdf',
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/ja-JP/ce-qb/10.0.1/ja-CEQB_AppGuide.pdf',
        },
        {
          label: 'インストールガイド',
          url: '/l10n/ja-JP/ce-qb/10.0.1/ja-CEQB_ConfigurationGuide.pdf',
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/ja-JP/ce-qb/10.0.1/ja-CEQB_InstallGuide.pdf',
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/ja-JP/ce-qb/10.0.1/ja-CEQB_Live Style Guide Install and Config.pdf.pdf',
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
