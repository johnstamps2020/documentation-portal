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
          docId: 'dhrn202209',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dhproduct202209',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dhinstall202209',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dhupgrade202209',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dhconfig202209',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dhdataspec202209',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dhadmin202209',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dhdevref202209',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'DataHub for Guidewire Cloud 2022.09',
    items: allSelectors.sfed7994657143200653022090cd6c022,
    labelColor: 'black',
  },
};

export default function LandingPage202209() {
  return <SectionLayout {...pageConfig} />;
}
