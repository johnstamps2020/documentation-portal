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
          label: "Guida all'installazione per sviluppatori",
          url: '/l10n/it-IT/pc/2022.05/PC-DeveloperSetupGuide-IT.pdf',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/2020.05/ISCL_202005_it_IT_PC-AppGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/10.1.1/PC1011-it_IT-AppGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/10.0.2/it-PC-AppGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/10.0.0/it-PC-AppGuide.pdf',
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
