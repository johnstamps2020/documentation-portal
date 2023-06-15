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
          label: 'Guía de Advanced Product Designer para PolicyCenter',
          url: '/l10n/es-ES/apd/2022.05/AdvancedProductDesigner_es-ES.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Apd() {
  return <CategoryLayout {...pageConfig} />;
}
