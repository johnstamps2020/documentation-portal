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
          docId: 'icrn202302',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc:
            'data-management/data-management-2023.02-garmisch-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202302',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202302',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202302',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202302',
        },
        {
          label: 'Upgrade Guide',
          docId: 'icupgrade202302',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202302',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202302',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202302',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202302',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2023.02',
    items: allSelectors.s06dcd02c361b9539495548fd0bfb3ad2,
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
