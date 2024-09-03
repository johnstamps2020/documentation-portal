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
          docId: 'dhrn202302',
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
          docId: 'dhproduct202302',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dhinstall202302',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dhupgrade202302',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dhconfig202302',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dhdataspec202302',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dhadmin202302',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dhdevref202302',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'DataHub for Guidewire Cloud 2023.02',
    items: allSelectors.s06dcd02c361b9539495548fd0bfb3ad2,
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
