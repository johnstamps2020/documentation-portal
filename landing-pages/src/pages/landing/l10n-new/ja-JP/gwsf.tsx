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
      label: '2021.11',
      items: [
        {
          label: 'インストールガイド',
          docId: 'dxgwsfinstall202111jaJP',
        },
      ],
    },
  ],
};

export default function Gwsf() {
  return <CategoryLayout {...pageConfig} />;
}
