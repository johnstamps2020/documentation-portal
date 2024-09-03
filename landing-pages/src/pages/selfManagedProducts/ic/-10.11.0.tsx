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
          docId: 'ic10110rn',
        },
        {
          label: 'Support Matrix',
          docId: 'supportmatrices',
          pathInDoc: 'data-management/data-management-10.11-support-matrix.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic10110product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic10110biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic10110reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic10110install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic10110upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic10110config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic10110dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic10110admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic10110devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.11.0',
    items: allSelectors.sb35d4e892240f17b86dfe15d52370102,
    labelColor: 'black',
  },
};

export default function LandingPage10110() {
  return <SectionLayout {...pageConfig} />;
}
