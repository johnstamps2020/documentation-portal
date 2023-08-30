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
    selectedItemLabel: 'CustomerEngage Quote and Buy',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/ce-qb/11.1/ja-CE_QB_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/ce-qb/10.0.1/ja-CEQB_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/ce-qb/10.0.1/ja-CEQB_Live Style Guide Install and Config.pdf.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/ce-qb/10.0.1/ja-CEQB_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/ce-qb/10.0.1/ja-CEQB_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/pdfs/ja-JP/ce-qb/10.0.1/ja-CEQB_Admin and Security Guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}