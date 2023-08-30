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
          docId: 'midipgrnen37',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipgrnde37',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'midipgapp37',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipgappde37',
        },
        {
          label: 'Implementation',
          docId: 'midipgimpl37',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'midipginstall37',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'midipgglossary37',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '3.7',
    items: allSelectors.scf866456342474178729593fa394b976,
    labelColor: 'black',
  },
};

export default function LandingPage37() {
  return <SectionLayout {...pageConfig} />;
}
