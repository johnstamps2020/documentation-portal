import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
          docId: 'midipgrnen38',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipgrnde38',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'midipgapp38',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipgappde38',
        },
        {
          label: 'Implementation',
          docId: 'midipgimpl38',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'midipginstall38',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'midipgglossary38',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '3.8',
    items: allSelectors.scf866456342474178729593fa394b976,
    labelColor: 'black',
  },
};

export default function LandingPage38() {
  return <SectionLayout {...pageConfig} />;
}
