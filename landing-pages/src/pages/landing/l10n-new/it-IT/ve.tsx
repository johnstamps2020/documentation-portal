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
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/ve/2022.05/it-IT Digital ..2022.05 VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guida all'installazione",
          url: '/l10n/it-IT/ve/2022.05/it-IT Digital v.2022.05 VE InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/it-IT/ve/11.3/it-VE-IT -11.3-onprem InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/ve/10.0.1/it-VE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
