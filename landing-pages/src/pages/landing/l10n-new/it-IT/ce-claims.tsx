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
          label: "Guida all'installazione",
          url: '/l10n/it-IT/ce-claims/2022.05/it-IT Digital v.2022.05 CE-AM Claims InstallGuide.pdf',
        },
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/ce-claims/2022.05/it-IT Digital v.2022.05 CE-AM Claims_AppGuide.pdf',
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/it-IT/ce-claims/11.3/it-CE-Claims-11.3-onprem- InstallGuide.pdf',
        },
      ],
    },
  ],
};

export default function Ceclaims() {
  return <CategoryLayout {...pageConfig} />;
}
