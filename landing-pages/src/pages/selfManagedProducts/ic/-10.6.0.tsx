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
          docId: 'ic1060rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic1060product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic1060biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic1060reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic1060install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic1060upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic1060config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic1060dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic1060admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic1060devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.6.0',
    items: allSelectors.sb35d4e892240f17b86dfe15d52370102,
    labelColor: 'black',
  },
};

export default function LandingPage1060() {
  return <SectionLayout {...pageConfig} />;
}
