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
    selectedItemLabel: 'CustomerEngage Account Management for ClaimCenter',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/ce-claims/2022.05/ja-JP-2022.05-ceclaims_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'アプリケーションガイド',
          url: '/l10n/pdfs/ja-JP/ce-claims/2022.05/CustomerEngage_Claims_AppGuide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: '開発者ガイド',
          url: '/l10n/pdfs/ja-JP/ce-claims/2022.05/CustomerEngage_Claims_DevelopersGuide_ja-JP.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
