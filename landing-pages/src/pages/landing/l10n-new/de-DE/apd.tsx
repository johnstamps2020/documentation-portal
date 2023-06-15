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
          label: 'Handbuch Advanced Product Designer für PolicyCenter',
          url: '/l10n/de-DE/apd/2022.05/AdvancedProductDesigner-DE.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Apd() {
  return <CategoryLayout {...pageConfig} />;
}
