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
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'リリースノート',
      items: [
        {
          label: 'Guidewire Cloud Platform リリースノート',
          docId: 'gwcpjaJPreleasenotes',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label: 'Guidewire Cloud Home ヘルプ',
          docId: 'gchjaJPhelprelease',
        },
        {
          label: 'Cloud Standards',
          docId: 'standards202312jaJP',
        },
        {
          label: 'クラウド連携の概要',
          docId: 'is202310jaJPintegoverview',
        },
        {
          label: 'Autopilot Workflow Service',
          pagePath: 'l10n/ja-JP/cloudProducts/autopilotworkflowservice',
        },
      ],
    },
    {
      label: '2022.09 (Flaine)',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cp/2022.09/GWCP-ReleaseNotes_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire Cloud Console ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cp/2022.09/guidewire_cloud_platform_guide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire Cloud Platform の操作',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cp/2022.09/CloudPlatform_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatestjaJP',
        },
      ],
    },
    {
      label: '2022.06',
      items: [
        {
          label: 'Cloud Standards',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cp/2022.06/CloudStandards(surepath)-JA.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/cp')({
  component: Cp,
});

function Cp() {
  return <CategoryLayout {...pageConfig} />;
}
