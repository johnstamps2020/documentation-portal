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
          docId: 'ispc1021releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc1021newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'ispc1021install',
        },
        {
          label: 'Upgrade',
          docId: 'ispc1021upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc1021app',
        },
        {
          label: 'Contact Management',
          docId: 'ispc1021contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'ispc1021isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'ispc1021best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc1021admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc1021apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc1021config',
        },
        {
          label: 'Globalization',
          docId: 'ispc1021global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc1021rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc1021pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc1021pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'ispc1021integ',
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
          docId: 'ispc1021testing',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc1021restapifw',
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
    selectedItemLabel: '10.2.1',
    items: allSelectors.sd4cfce517036cd3d69b73986f470aff5,
    labelColor: 'black',
  },
};

export default function LandingPage1021() {
  return <SectionLayout {...pageConfig} />;
}
