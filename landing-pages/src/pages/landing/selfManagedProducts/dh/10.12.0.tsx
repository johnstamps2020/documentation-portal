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
          docId: 'dh10120rn',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc: 'data-management/data-management-10.12-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dh10120product',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dh10120install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dh10120upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dh10120config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dh10120dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dh10120admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dh10120devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.12.0',
    items: allSelectors.sed0f6b3f0c92246ce605b08874712f8d,
    labelColor: 'black',
  },
};

export default function LandingPage10120() {
  return <SectionLayout {...pageConfig} />;
}
