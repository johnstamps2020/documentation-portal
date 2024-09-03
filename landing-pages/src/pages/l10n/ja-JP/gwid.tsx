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
    selectedItemLabel: 'Guidewire Identity Federation Hub',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '',
      items: [
        {
          label: 'Guidewire Identity Federation Hub を使用した認証',
          docId: 'guidewireidentityfederationhubjaJP',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/gwid')({
  component: Gwid,
});

function Gwid() {
  return <CategoryLayout {...pageConfig} />;
}
