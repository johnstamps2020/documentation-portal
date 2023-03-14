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
          docId: 'ic1080rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic1080product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic1080biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic1080reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic1080install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic1080upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic1080config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic1080dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic1080admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic1080devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.8.0',
    items: [
      {
        label: '10.8.0',
        pagePath: '',
      },
      {
        label: '10.7.0',
        pagePath: 'selfManagedProducts/ic/10.7.0',
      },
      {
        label: '10.6.0',
        pagePath: 'selfManagedProducts/ic/10.6.0',
      },
      {
        label: '10.5.0',
        pagePath: 'selfManagedProducts/ic/10.5.0',
      },
      {
        label: '10.4.0',
        docId: 'ic1040',
      },
      {
        label: '10.3.0',
        docId: 'ic1030',
      },
      {
        label: '10.2.0',
        docId: 'ic1020',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1080() {
  return <SectionLayout {...pageConfig} />;
}
