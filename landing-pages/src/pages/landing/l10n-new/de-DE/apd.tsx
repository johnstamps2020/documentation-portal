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
      label: '2022.05',
      items: [
        {
          label: 'Handbuch Advanced Product Designer für PolicyCenter',
          url: '/l10n/de-DE/apd/2022.05/AdvancedProductDesigner-DE.pdf',
        },
      ],
    },
  ],
};

export default function Apd() {
  return <CategoryLayout {...pageConfig} />;
}
