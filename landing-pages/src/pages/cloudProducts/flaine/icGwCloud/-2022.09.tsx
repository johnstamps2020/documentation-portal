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
          docId: 'icrn202209',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'icproduct202209',
        },
        {
          label: 'BI Applications Guide',
          docId: 'icbiapp202209',
        },
        {
          label: 'Reports Guide',
          docId: 'icreports202209',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'icinstall202209',
        },
        {
          label: 'Upgrade Guide',
          docId: 'icupgrade202209',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'icconfig202209',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icdataspec202209',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'icadmin202209',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icdevref202209',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2022.09',
    items: allSelectors.sfed7994657143200653022090cd6c022,
    labelColor: 'black',
  },
};

export default function LandingPage202209() {
  return <SectionLayout {...pageConfig} />;
}
