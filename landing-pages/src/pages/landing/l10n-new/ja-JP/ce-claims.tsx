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
          label: 'インストールガイド',
          docId: 'dx202205jaJPceclaimsinstall',
        },
        {
          label: 'アプリケーションガイド',
          docId: 'dx202205jaJPceclaimsapp',
        },
        {
          label: '開発者ガイド',
          docId: 'dx202205jaJPceclaimsdev',
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
