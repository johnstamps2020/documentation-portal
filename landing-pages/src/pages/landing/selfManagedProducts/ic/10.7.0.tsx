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
          docId: 'ic1070rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic1070product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic1070biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic1070reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic1070install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic1070upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic1070config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic1070dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic1070admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic1070devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.7.0',
    items: [
      {
        label: '10.7.0',
        pagePath: 'selfManagedProducts/ic/10.7.0',
      },
      {
        label: '10.8.0',
        pagePath: 'selfManagedProducts/ic/10.8.0',
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

export default function LandingPage1070() {
  return <SectionLayout {...pageConfig} />;
}
