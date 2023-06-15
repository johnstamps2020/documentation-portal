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
      label: '0',
      items: [
        {
          label: 'Guidewire Cloud Console',
          url: '/l10n/pt-BR/gcc/0/pt-BR-GuidewireCloudConsole.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}
