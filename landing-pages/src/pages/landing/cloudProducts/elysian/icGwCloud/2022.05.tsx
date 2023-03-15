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
          docId: 'icrn202205',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202205',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202205',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202205',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202205',
        },
        {
          label: 'Upgrade Guide',
          docId: 'icupgrade202205',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202205',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202205',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202205',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202205',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2022.05',
    items: [
      {
        label: 'DataHub for Guidewire Cloud 2022.05',
        pagePath: 'cloudProducts/elysian/dhGwCloud/2022.05',
      },
      {
        label: 'InfoCenter for Guidewire Cloud 2022.05',
        pagePath: 'cloudProducts/elysian/icGwCloud/2022.05',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202205() {
  return <SectionLayout {...pageConfig} />;
}
