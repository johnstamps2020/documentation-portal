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
    selectedItemLabel: 'CustomerEngage Quote and Buy',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'CustomerEngage Quote and Buy リリースノート',
          docId: 'dx202407jaJPceqbrelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202407jaJPupdate',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ce-qb/11.1/ja-CE_QB_InstallGuide.pdf',
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
          pathInDoc: 'ja-JP/ce-qb/10.0.1/ja-CEQB_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/ce-qb/10.0.1/ja-CEQB_Live Style Guide Install and Config.pdf.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ce-qb/10.0.1/ja-CEQB_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ce-qb/10.0.1/ja-CEQB_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: '管理およびセキュリティガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/ce-qb/10.0.1/ja-CEQB_Admin and Security Guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/ce-qb')({
  component: Ceqb,
});

function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
