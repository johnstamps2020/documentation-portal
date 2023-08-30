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
    selectedItemLabel: 'VendorEngage',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: '開発者ガイド',
          url: '/l10n/pdfs/ja-JP/ve/2022.05/VendorEngage_DevelopersGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/ve/2022.05/ja-JP-2022.05-ve_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/ve/2022.05/VendorEngage_AppGuide_ja-JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/ve/11.1/ja-VE-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/pdfs/ja-JP/ve/10.0.1/ja-VE_Admin and Security Guide.pdf',
          videoIcon: false,
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/ve/10.0.1/ja-VE_Live Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/ve/10.0.1/ja-VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/ve/10.0.1/ja-VE_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
