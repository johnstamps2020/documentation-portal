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
    selectedItemLabel: 'Guidewire Identity Federation Hub',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.04',
      items: [
        {
          label: 'Guidewire Identity Federation Hub を使用した認証',
          url: '/l10n/pdfs/ja-JP/gwid/2021.04/ja-JP-2021.04-GuidewireHub.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gwid() {
  return <CategoryLayout {...pageConfig} />;
}
