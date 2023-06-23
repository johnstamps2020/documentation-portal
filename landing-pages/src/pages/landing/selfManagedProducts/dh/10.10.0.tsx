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
          docId: 'dh10100rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dh10100product',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dh10100install',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dh10100upgrade',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dh10100config',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dh10100dataspec',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dh10100admin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dh10100devref',
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
        docId: 'dh1000',
      },
      {
        label: '10.1.0',
        docId: 'dh1010',
      },
      {
        label: '10.10.0',
        pagePath: 'selfManagedProducts/dh/10.10.0',
      },
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
      {
        label: '10.9.0',
        pagePath: 'selfManagedProducts/dh/10.9.0',
      },
      {
        label: '8.1.0',
        docId: 'dh810',
      },
      {
        label: '8.1.1',
        docId: 'dh811',
      },
      {
        label: '8.2.0',
        docId: 'dh820',
      },
      {
        label: '8.3.0',
        docId: 'dh830',
      },
      {
        label: '9.0.0',
        docId: 'dh900',
      },
      {
        label: '9.1.0',
        docId: 'dh910',
      },
      {
        label: '9.2.0',
        docId: 'dh920',
      },
      {
        label: '9.3.0',
        docId: 'dh930',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage10100() {
  return <SectionLayout {...pageConfig} />;
}
