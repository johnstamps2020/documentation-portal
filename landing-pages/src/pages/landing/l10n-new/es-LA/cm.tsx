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
      label: '2021.11',
      items: [
        {
          label: 'Guía de administración de contactos de Guidewire',
          docId: 'is202111contactes419',
        },
      ],
    },
  ],
};

export default function Cm() {
  return <CategoryLayout {...pageConfig} />;
}
