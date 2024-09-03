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
          docId: 'dhrn202407',
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
          docId: 'dhproduct202407',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dhinstall202407',
        },
        {
          label: 'Update Guide',
          docId: 'dhupgrade202407',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dhconfig202407',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dhdataspec202407',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dhadmin202407',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dhdevref202407',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'DataHub for Guidewire Cloud 2024.07',
    items: allSelectors.dhic202407,
    labelColor: 'black',
  },
};

export const Route = createFileRoute('/cloudProducts/kufri/dh')({
  component: LandingPage202407,
});

function LandingPage202407() {
  return <SectionLayout {...pageConfig} />;
}
