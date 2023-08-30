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
    selectedItemLabel: 'ServiceRepEngage',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.02',
      items: [
        {
          label: 'リリースノート',
          url: '/l10n/pdfs/ja-JP/sre/2023.02/Loc_ReleaseNotes_sre.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.05',
      items: [
        {
          label: '開発者ガイド',
          url: '/l10n/pdfs/ja-JP/sre/2022.05/ServiceRepEngage_DevelopersGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/sre/2022.05/ja-JP-2022.05-sre_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/sre/2022.05/ServiceRepEngage_AppGuide_ja-JP.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/sre/11.1/ja-SRE onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/sre/10.0.1/ja-SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/pdfs/ja-JP/sre/10.0.1/ja-SRE_Admin and Security Guide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/sre/10.0.1/ja-SRE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/sre/10.0.1/ja-SRE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/sre/10.0.1/ja-SRE_Live Style Guide Install and Config.pdf.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
