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
          docId: 'dh1060rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dh1060product',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dh1060install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dh1060upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dh1060config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dh1060dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dh1060admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dh1060devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.6.0',
    items: [
      {
        label: '10.2.0',
        docId: 'dh1020',
      },
      {
        label: '10.3.0',
        docId: 'dh1030',
      },
      {
        label: '10.4.0',
        docId: 'dh1040',
      },
      {
        label: '10.5.0',
        pagePath: 'selfManagedProducts/dh/10.5.0',
      },
      {
        label: '10.6.0',
        pagePath: 'selfManagedProducts/dh/10.6.0',
      },
      {
        label: '10.7.0',
        pagePath: 'selfManagedProducts/dh/10.7.0',
      },
      {
        label: '10.8.0',
        pagePath: 'selfManagedProducts/dh/10.8.0',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1060() {
  return <SectionLayout {...pageConfig} />;
}