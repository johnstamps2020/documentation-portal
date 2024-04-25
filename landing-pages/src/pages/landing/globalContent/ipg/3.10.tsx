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
          docId: 'midipg310rnen',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipg310rnde',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'midipg310app',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipg310appde',
        },
        {
          label: 'Implementation',
          docId: 'midipg310impl',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'midipg310install',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'midipg310glossary',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '3.10',
    items: allSelectors.scf866456342474178729593fa394b976,
    labelColor: 'black',
  },
};

export default function LandingPage310() {
  return <SectionLayout {...pageConfig} />;
}
