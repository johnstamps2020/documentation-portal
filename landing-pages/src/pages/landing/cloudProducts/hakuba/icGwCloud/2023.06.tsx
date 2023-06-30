import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

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
          docId: 'icrn202306',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202306',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202306',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202306',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202306',
        },
        {
          label: 'Upgrade Guide',
          docId: 'icupgrade202306',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202306',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202306',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202306',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202306',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2023.06',
    items: [
      {
        label: 'DataHub for Guidewire Cloud 2023.06',
        pagePath: 'cloudProducts/hakuba/dhGwCloud/2023.06',
      },
      {
        label: 'InfoCenter for Guidewire Cloud 2023.06',
        pagePath: 'cloudProducts/hakuba/icGwCloud/2023.06',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202306() {
  return <SectionLayout {...pageConfig} />;
}
