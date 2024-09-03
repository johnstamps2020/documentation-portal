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
          docId: 'ispc1022releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc1022newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'ispc1022install',
        },
        {
          label: 'Upgrade',
          docId: 'ispc1022upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc1022app',
        },
        {
          label: 'Contact Management',
          docId: 'ispc1022contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'ispc1022isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'ispc1022best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc1022admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc1022apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc1022config',
        },
        {
          label: 'Globalization',
          docId: 'ispc1022global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc1022rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc1022pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc1022pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'ispc1022integ',
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
          docId: 'ispc1022testing',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc1022restapifw',
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
    selectedItemLabel: '10.2.2',
    items: allSelectors.sd4cfce517036cd3d69b73986f470aff5,
    labelColor: 'black',
  },
};

export default function LandingPage1022() {
  return <SectionLayout {...pageConfig} />;
}
