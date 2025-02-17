import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
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
          docId: 'icrn202407',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc:
            'data-management/data-management-2024.07-kufri-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202407',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202407',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202407',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202407',
        },
        {
          label: 'Update Guide',
          docId: 'icupgrade202407',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202407',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202407',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202407',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202407',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2024.07',
    items: allSelectors.dhic202407,
    labelColor: 'black',
  },
};

export const Route = createFileRoute('/cloudProducts/kufri/ic')({
  component: LandingPage202407,
});

function LandingPage202407() {
  return <SectionLayout {...pageConfig} />;
}
