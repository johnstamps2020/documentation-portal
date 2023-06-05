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
          url: '/l10n/it-IT/ce-am/2022.05/it-IT Digital v.2022.05 CE-AM InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/ce-am/2022.05/it-IT Digital v.2022.05 CE-AM_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/it-IT/ce-am/11.3/it-CEAM-11.3-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/ce-am/10.0.1/it-CEAM_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceam() {
  return <CategoryLayout {...pageConfig} />;
}
