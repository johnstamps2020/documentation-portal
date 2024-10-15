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
    selectedItemLabel: 'InsuranceSuite Contact Management',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2024.07 Kufri',
      items: [
        {
          label: 'Guidewire 連絡先管理ガイド',
          docId: 'is202407jaJPcontact',
        },
      ],
    },
    {
      label: '2022.05 Elysian',
      items: [
        {
          label: 'Guidewire 連絡先管理ガイド',
          docId: 'is202205contactjaJP',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/cm')({
  component: Cm,
});

function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
