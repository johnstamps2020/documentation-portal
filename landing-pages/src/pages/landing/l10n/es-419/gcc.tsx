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
      label: '',
      items: [
        {
          label: 'Consola de Guidewire Cloud',
          docId: 'guidewirecloudconsolerootinsurerdeves419',
        },
      ],
    },
  ],
};

export default function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}
