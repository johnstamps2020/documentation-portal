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
          docId: 'iscc1021releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'iscc1021newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'iscc1021install',
        },
        {
          label: 'Upgrade',
          docId: 'iscc1021upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'iscc1021app',
        },
        {
          label: 'Contact Management',
          docId: 'iscc1021contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'iscc1021isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'iscc1021best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc1021admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc1021config',
        },
        {
          label: 'Globalization',
          docId: 'iscc1021global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc1021rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'iscc1021integ',
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
          docId: 'iscc1021testing',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc1021restapifw',
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
    items: allSelectors.s955bea8e86fa79506b9afde1d512206d,
    labelColor: 'black',
  },
};

export default function LandingPage1021() {
  return <SectionLayout {...pageConfig} />;
}
