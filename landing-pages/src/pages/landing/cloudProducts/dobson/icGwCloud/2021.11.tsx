import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'icrn202111',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202111',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202111',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202111',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202111',
        },
        {
          label: 'Upgrade Guide',
          docId: 'icupgrade202111',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202111',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202111',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202111',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202111',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2021.11',
    items: [
      {
        label: 'InfoCenter for Guidewire Cloud 2021.11',
        pagePath: 'cloudProducts/dobson/icGwCloud/2021.11',
      },
      {
        label: 'DataHub for Guidewire Cloud 2021.11',
        pagePath: 'cloudProducts/dobson/dhGwCloud/2021.11',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202111() {
  return <SectionLayout {...pageConfig} />;
}
