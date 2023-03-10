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
      label: '2021.04',
      items: [
        {
          label: 'Guidewire Identity Federation Hub を使用した認証',
          docId: 'guidewireidentityfederationhubjaJP',
        },
      ],
    },
  ],
};

export default function Gwid() {
  return <CategoryLayout {...pageConfig} />;
}
