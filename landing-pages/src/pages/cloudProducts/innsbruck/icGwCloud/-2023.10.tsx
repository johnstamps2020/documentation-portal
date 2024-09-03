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
          docId: 'icrn202310',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc:
            'data-management/data-management-2023.10-innsbruck-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202310',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202310',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202310',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202310',
        },
        {
          label: 'Upgrade Guide',
          docId: 'icupgrade202310',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202310',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202310',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202310',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202310',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2023.10',
    items: allSelectors.dhic202310,
    labelColor: 'black',
  },
};

export default function LandingPage202310() {
  return <SectionLayout {...pageConfig} />;
}
