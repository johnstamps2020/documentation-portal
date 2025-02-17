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
          docId: 'ic10100rn',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc: 'data-management/data-management-10.10-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic10100product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic10100biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic10100reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic10100install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic10100upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic10100config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic10100dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic10100admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic10100devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.10.0',
    items: allSelectors.sb35d4e892240f17b86dfe15d52370102,
    labelColor: 'black',
  },
};

export default function LandingPage10100() {
  return <SectionLayout {...pageConfig} />;
}
