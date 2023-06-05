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

  cards: [
    {
      label: '2021.04',
      items: [
        {
          label: 'Autenticazione con Guidewire Identity Federation Hub',
          url: '/l10n/it-IT/gwid/2021.04/IT-GW-FederationHub.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Gwid() {
  return <CategoryLayout {...pageConfig} />;
}
