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
    selectedItemLabel: 'Garmisch (2023.02) の新機能',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/VendorEngage/Loc_ReleaseNotes_ve.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/ServiceRepEngage/Loc_ReleaseNotes_sre.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Guidewire Testing',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/Guidewire Testing/Guidewire_Test_Automation202302_ReleaseNotes.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Garmisch',
      items: [
        {
          label: 'Garmisch の新機能',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/202302garmischwhatsnew/Garmisch/whatsnew.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/CustomerEngage Account Management for ClaimCenter/Loc_ReleaseNotes_ceclaims.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Cloud Platform',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/Cloud Platform/GWCP-ReleaseNotes.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'コンフィギュレーションアップグレードツールガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/ClaimCenter/InsuranceSuiteConfigurationUpgradeTools.pdf',
          videoIcon: false,
        },
        {
          label: 'アップデートガイド',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/202302garmischwhatsnew/ClaimCenter/UpdateGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'コンフィギュレーションアップグレードツールの互換性',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/ClaimCenter/ISUpgradeCompatibility.pdf',
          videoIcon: false,
        },
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/202302garmischwhatsnew/ClaimCenter/ClaimCenter_ReleaseNotes.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/202302garmischwhatsnew')({
  component: LandingPage202302garmischwhatsnew,
});

function LandingPage202302garmischwhatsnew() {
  return <CategoryLayout {...pageConfig} />;
}
