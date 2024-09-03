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
          docId: 'dh1080rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dh1080product',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dh1080install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dh1080upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dh1080config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dh1080dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dh1080admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dh1080devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.8.0',
    items: allSelectors.sed0f6b3f0c92246ce605b08874712f8d,
    labelColor: 'black',
  },
};

export default function LandingPage1080() {
  return <SectionLayout {...pageConfig} />;
}
