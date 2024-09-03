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
          docId: 'ispc1023releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc1023newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'ispc1023install',
        },
        {
          label: 'Upgrade',
          docId: 'ispc1023upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc1023app',
        },
        {
          label: 'Contact Management',
          docId: 'ispc1023contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'ispc1023isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'ispc1023best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc1023admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc1023apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc1023config',
        },
        {
          label: 'Globalization',
          docId: 'ispc1023global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc1023rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc1023pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc1023pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'ispc1023integ',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Gosu Reference',
          docId: 'gosureflatest',
        },
        {
          label: 'ISBTF and GUnit Testing',
          docId: 'ispc1023testing',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc1023restapifw',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'gwglossary',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '10.2.3',
    items: allSelectors.sd4cfce517036cd3d69b73986f470aff5,
    labelColor: 'black',
  },
};

export default function LandingPage1023() {
  return <SectionLayout {...pageConfig} />;
}
