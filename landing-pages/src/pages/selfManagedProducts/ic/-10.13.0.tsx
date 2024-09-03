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
          docId: 'ic10130rn',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc:
            'data-management/data-management-10.13.0-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic10130product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic10130biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic10130reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic10130install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic10130upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic10130config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic10130dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic10130admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic10130devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.13.0',
    items: allSelectors.sb35d4e892240f17b86dfe15d52370102,
    labelColor: 'black',
  },
};

export default function LandingPage10130() {
  return <SectionLayout {...pageConfig} />;
}
