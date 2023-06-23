import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: "Guida all'applicazione",
          docId: 'ispc202205itITapp',
        },
        {
          label: 'Guida alla configurazione',
          docId: 'ispc202205itITconfig',
        },
        {
          label: "Guida all'installazione per sviluppatori",
          docId: 'ispc202205itITdevsetup',
        },
        {
          label: 'Guida ad Advanced Product Designer per PolicyCenter',
          docId: 'ispc202205itITapd',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/2020.05/ISCL_202005_it_IT_PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/10.1.1/PC1011-it_IT-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/10.0.2/it-PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: "Guida all'applicazione",
          url: '/l10n/it-IT/pc/10.0.0/it-PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
