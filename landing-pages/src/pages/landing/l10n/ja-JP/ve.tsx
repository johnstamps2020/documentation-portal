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
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'VendorEngage リリースノート',
          docId: 'dx202407jaJPverelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202407jaJPupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label: 'VendorEngage リリースノート',
          docId: 'dx202402jaJPverelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202402jaJPupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'VendorEngage リリースノート',
          docId: 'dx202310jaJPverelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202310jaJPupdate',
        },
      ],
    },
    {
      label: '2023.06 (Hakuba)',
      items: [
        {
          label: 'リリースノート',
          docId: 'dx202306javerelnotes',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.05 (Elysian)',
      items: [
        {
          label: 'インストールガイド',
          docId: 'dx202205jaJPveinstall',
        },
        {
          label: '開発者ガイド',
          docId: 'dx202205jaJPvedev',
        },
        {
          label: 'アプリケーションガイド',
          docId: 'dx202205jaJPveapp',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ve/11.1/ja-VE-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: '管理およびセキュリティガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ve/10.0.1/ja-VE_Admin and Security Guide.pdf',
          videoIcon: false,
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/ve/10.0.1/ja-VE_Live Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ve/10.0.1/ja-VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ve/10.0.1/ja-VE_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
