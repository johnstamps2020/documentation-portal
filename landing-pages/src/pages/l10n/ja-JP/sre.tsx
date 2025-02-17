import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

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
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'ServiceRepEngage リリースノート',
          docId: 'dx202407jaJPsrerelnotes',
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
          label: 'ServiceRepEngage リリースノート',
          docId: 'dx202402jaJPsrerelnotes',
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
          label: 'ServiceRepEngage リリースノート',
          docId: 'dx202310jaJPsrerelnotes',
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
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/sre/2023.02/Loc_ReleaseNotes_sre.pdf',
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
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/sre/11.1/ja-SRE onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'コンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/sre/10.0.1/ja-SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: '管理およびセキュリティガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/sre/10.0.1/ja-SRE_Admin and Security Guide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/sre/10.0.1/ja-SRE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/sre/10.0.1/ja-SRE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/sre/10.0.1/ja-SRE_Live Style Guide Install and Config.pdf.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/sre')({
  component: Sre,
});

function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
