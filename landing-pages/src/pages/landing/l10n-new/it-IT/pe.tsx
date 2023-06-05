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
          url: '/l10n/it-IT/pe/2022.05/it-IT Digital v.2022.05 PE InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pe/2022.05/it-IT Digital v.2022.05 PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.08',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/it-IT/pe/2020.08/it-PE-202008-cloud-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.3',
      items: [
        {
          label: "Guida all'installazione",
          url: '/l10n/it-IT/pe/11.3/it-PE-11.3-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pe/10.0.1/it_PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
