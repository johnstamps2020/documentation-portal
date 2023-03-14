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
          label: 'Guía de la aplicación',
          url: '/l10n/es-LA/cda/2021.11/es-LA-CloudDataAccess.pdf',
        },
      ],
    },
  ],
};

export default function Cda() {
  return <CategoryLayout {...pageConfig} />;
}
