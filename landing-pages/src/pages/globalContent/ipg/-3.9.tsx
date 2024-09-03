import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { allSelectors } from 'components/allSelectors';

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
          docId: 'midipgrnen39',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipgrnde39',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'midipgapp39',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipgappde39',
        },
        {
          label: 'Implementation',
          docId: 'midipgimpl39',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'midipginstall39',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'midipgglossary39',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '3.9',
    items: allSelectors.scf866456342474178729593fa394b976,
    labelColor: 'black',
  },
};

export default function LandingPage39() {
  return <SectionLayout {...pageConfig} />;
}
