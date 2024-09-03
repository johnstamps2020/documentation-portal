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
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'ProducerEngage リリースノート',
          docId: 'dx202407jaJPperelnotes',
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
          pathInDoc: 'ja-JP/pe/11.1/ja-PE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/pe/11.1/ja-PE-cloud_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label:
            'ライブスタイルガイド：インストールおよびコンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/pe/10.0.1/ja-SRE_Live Style Guide Install and Config.pdf.pdf',
          videoIcon: false,
        },
        {
          label: '管理およびセキュリティガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/pe/10.0.1/ja-PE_Admin and Security Guide_Japanese_1001.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/pe/10.0.1/ja-PE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/pe/10.0.1/ja-PE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/pe/10.0.1/ja-PE_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/pe')({
  component: Pe,
});

function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
