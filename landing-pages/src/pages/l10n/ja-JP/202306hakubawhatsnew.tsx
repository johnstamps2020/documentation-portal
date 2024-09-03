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
    selectedItemLabel: 'Hakuba (2023.06) の新機能',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Hakuba (2023.06) の新機能',
      items: [
        {
          label: 'Hakuba (2023.06) の新機能',
          docId: 'whatsnewjahakuba',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'リリースノート',
          docId: 'iscc202306jareleasenotes',
          videoIcon: false,
        },
        {
          label: 'アップデート',
          docId: 'iscc202306jaupdate',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Guidewire Testing',
      items: [
        {
          label: 'リリースノート',
          docId: 'testingframeworksjarnhakuba',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'リリースノート',
          docId: 'dx202306jaceclaimsrelnotes',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'リリースノート',
          docId: 'dx202306jasrerelnotes',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'リリースノート',
          docId: 'dx202306javerelnotes',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/202306hakubawhatsnew')({
  component: LandingPage202306hakubawhatsnew,
});

function LandingPage202306hakubawhatsnew() {
  return <CategoryLayout {...pageConfig} />;
}
