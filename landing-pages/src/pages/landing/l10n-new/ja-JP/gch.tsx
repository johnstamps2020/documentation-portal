import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: 'latest',
      items: [
        {
          label: 'Guidewire Cloud Home ヘルプ',
          docId: 'gchjaJPhelprelease',
        },
      ],
    },
  ],
};

export default function Gch() {
  return <CategoryLayout {...pageConfig} />;
}
