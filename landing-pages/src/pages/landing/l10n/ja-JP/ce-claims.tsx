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
      label: '2024.07 (Kufri)',
      items: [
        {
          label: 'CustomerEngage Account Management for ClaimCenter リリースノート',
          docId: 'dx202407jaJPceclaimsrelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202407jaJPupdate',
        },
      ],
    },
    {
      label: '2024.02 (Jasper)',
      items: [
        {
          label:
            'CustomerEngage Account Management for ClaimCenter リリースノート',
          docId: 'dx202402jaJPceclaimsrelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202402jaJPupdate',
        },
      ],
    },
    {
      label: '2023.10 (Innsbruck)',
      items: [
        {
          label:
            'CustomerEngage Account Management for ClaimCenter リリースノート',
          docId: 'dx202310jaJPceclaimsrelnotes',
        },
        {
          label: 'EnterpriseEngage アップデートガイド',
          docId: 'ee202310jaJPupdate',
        },
      ],
    },
    {
      label: '2023.06 (Hakuba)',
      items: [
        {
          label: 'リリースノート',
          docId: 'dx202306jaceclaimsrelnotes',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2022.05 (Elysian)',
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
