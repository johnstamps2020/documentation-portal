import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'midipgrnen36',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipgrnde36',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'midipgapp36',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipgappde36',
        },
        {
          label: 'Implementation',
          docId: 'midipgimpl36',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'midipginstall36',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'midipgglossary36',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '3.6',
    items: [
      {
        label: '3.6',
        pagePath: 'globalContent/ipg/3.6',
      },
      {
        label: '3.7',
        pagePath: 'globalContent/ipg/3.7',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage36() {
  return <SectionLayout {...pageConfig} />;
}