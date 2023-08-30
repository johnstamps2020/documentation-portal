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
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '11.1',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pe/11.1/ja-PE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pe/11.1/ja-PE-cloud_InstallGuide.pdf',
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
          url: '/l10n/pdfs/ja-JP/pe/10.0.1/ja-SRE_Live Style Guide Install and Config.pdf.pdf',
          videoIcon: false,
        },
        {
          label: '管理およびセキュリティガイド',
          url: '/l10n/pdfs/ja-JP/pe/10.0.1/ja-PE_Admin and Security Guide_Japanese_1001.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/pe/10.0.1/ja-PE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションガイド',
          url: '/l10n/pdfs/ja-JP/pe/10.0.1/ja-PE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/pe/10.0.1/ja-PE_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
