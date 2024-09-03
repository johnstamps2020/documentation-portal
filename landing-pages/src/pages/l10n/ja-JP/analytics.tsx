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
    selectedItemLabel: 'Analytics',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Explore',
      items: [
        {
          label: 'Explore ガイド',
          docId: 'exploreusingjaJPrelease',
        },
      ],
    },
    {
      label: 'Data Studio',
      items: [
        {
          label: 'Data Studio',
          docId: 'datastudiojaJPrelease',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/analytics')({
  component: Analytics,
});

function Analytics() {
  return <CategoryLayout {...pageConfig} />;
}
