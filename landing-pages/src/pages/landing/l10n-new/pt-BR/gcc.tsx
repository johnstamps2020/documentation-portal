import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: undefined,

  cards: [
    {
      label: '0',
      items: [
        {
          label: 'Guidewire Cloud Console',
          url: '/l10n/pt-BR/gcc/0/pt-BR-GuidewireCloudConsole.pdf',
        },
      ],
    },
  ],
};

export default function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}
