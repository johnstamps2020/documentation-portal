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
          docId: 'ic10100rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'ic10100product',
        },
        {
          label: 'BI Applications Guide',
          docId: 'ic10100biapp',
        },
        {
          label: 'Reports Guide',
          docId: 'ic10100reports',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'ic10100install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'ic10100upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ic10100config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'ic10100dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'ic10100admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'ic10100devref',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.10.0',
    items: [
      {
        label: '10.0.0',
        docId: 'ic1000',
      },
      {
        label: '10.1.0',
        docId: 'ic1010',
      },
      {
        label: '10.10.0',
        pagePath: 'selfManagedProducts/ic/10.10.0',
      },
      {
        label: '10.2.0',
        docId: 'ic1020',
      },
      {
        label: '10.3.0',
        docId: 'ic1030',
      },
      {
        label: '10.4.0',
        docId: 'ic1040',
      },
      {
        label: '10.5.0',
        pagePath: 'selfManagedProducts/ic/10.5.0',
      },
      {
        label: '10.6.0',
        pagePath: 'selfManagedProducts/ic/10.6.0',
      },
      {
        label: '10.7.0',
        pagePath: 'selfManagedProducts/ic/10.7.0',
      },
      {
        label: '10.8.0',
        pagePath: 'selfManagedProducts/ic/10.8.0',
      },
      {
        label: '10.9.0',
        pagePath: 'selfManagedProducts/ic/10.9.0',
      },
      {
        label: '8.1.0',
        docId: 'ic810',
      },
      {
        label: '8.1.1',
        docId: 'ic811',
      },
      {
        label: '8.2.0',
        docId: 'ic820',
      },
      {
        label: '8.2.1',
        docId: 'ic821',
      },
      {
        label: '8.3.0',
        docId: 'ic830',
      },
      {
        label: '9.0.0',
        docId: 'ic900',
      },
      {
        label: '9.1.0',
        docId: 'ic910',
      },
      {
        label: '9.2.0',
        docId: 'ic920',
      },
      {
        label: '9.3.0',
        docId: 'ic930',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage10100() {
  return <SectionLayout {...pageConfig} />;
}