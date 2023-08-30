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
    selectedItemLabel: 'Guidewire for Salesforce',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2021.11',
      items: [
        {
          label: 'インストールガイド',
          url: '/l10n/pdfs/ja-JP/gwsf/2021.11/ja-JP-2021.11-Guidewire_For_Salesforce_install-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gwsf() {
  return <CategoryLayout {...pageConfig} />;
}
