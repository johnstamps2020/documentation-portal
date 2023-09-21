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
      label: '2023.06 (Hakuba)',
      items: [
        {
          label: 'リリースノート',
          docId: 'dx202306jasrerelnotes',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2023.02 (Garmisch)',
      items: [
        {
          label: 'リリースノート',
          url: '/l10n/pdfs/ja-JP/sre/2023.02/Loc_ReleaseNotes_sre.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.05 (Elysian)',
      items: [
        {
          label: 'インストールガイド',
          docId: 'dx202205jaJPsreinstall',
        },
        {
          label: '開発者ガイド',
          docId: 'dx202205jaJPsredev',
        },
        {
          label: 'アプリケーションガイド',
          docId: 'dx202205jaJPsreapp',
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
