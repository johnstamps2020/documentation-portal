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
      label: 'Release notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'gwcpreleasenotes',
        },
      ],
    },
    {
      label: 'Cloud Infrastructure',
      items: [
        {
          label: 'Authentication',
          docId: 'guidewireidentityfederationhub',
        },
        {
          label: 'Network Connectivity',
          docId: 'cloudplatformrelease',
        },
        {
          label: 'GCC Internal Docs',
          docId: 'gccinternallatests',
        },
      ],
    },
    {
      label: 'Cloud Console',
      items: [
        {
          label: 'Cloud Console Guide',
          docId: 'guidewirecloudconsolerootinsurerdev',
        },
        {
          label: 'Cloud Console Guide (Early Access)',
          docId: 'guidewirecloudconsolerootearlyaccess',
        },
        {
          label: 'Data Masking (Early Access)',
          docId: 'datamasking',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'CI/CD Manager API',
          docId: 'cicdmanagerapiref',
        },
        {
          label: 'Cloud Console API',
          docId: 'cloudconsoleapi',
        },
        {
          label: 'Database Service API',
          docId: 'dbserviceapi',
        },
        {
          label: 'Repository Settings API',
          docId: 'repositorysettingsapi',
        },
        {
          label: 'Runtime Properties API',
          docId: 'runtimepropertiesapi',
        },
      ],
    },
  ],
};

export default function CloudConsole() {
  return <SectionLayout {...pageConfig} />;
}
