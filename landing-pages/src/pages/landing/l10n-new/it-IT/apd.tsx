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
      label: '2022.05',
      items: [
        {
          label: 'Guida ad Advanced Product Designer per PolicyCenter',
          docId: 'ispc202205apditIT',
        },
      ],
    },
  ],
};

export default function Apd() {
  return <CategoryLayout {...pageConfig} />;
}
