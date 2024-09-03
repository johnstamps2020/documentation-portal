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
          docId: 'isbc1023releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'isbc1023newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'isbc1023install',
        },
        {
          label: 'Upgrade',
          docId: 'isbc1023upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'isbc1023app',
        },
        {
          label: 'Contact Management',
          docId: 'isbc1023contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'isbc1023isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'isbc1023best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'isbc1023admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'isbc1023config',
        },
        {
          label: 'Globalization',
          docId: 'isbc1023global',
        },
        {
          label: 'Gosu Rules',
          docId: 'isbc1023rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'isbc1023integ',
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
          docId: 'isbc1023testing',
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
    items: allSelectors.s6b92fc418ffa288afcda2302a844bbce,
    labelColor: 'black',
  },
};

export default function LandingPage1023() {
  return <SectionLayout {...pageConfig} />;
}
