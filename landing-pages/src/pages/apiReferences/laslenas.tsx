import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-kufri.png';

import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundAttachment: 'scroll',
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${backgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Las Leñas',
    items: allSelectors.s0f196c0b55cf55f2cdd1e05b1bf5e94e,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapiref202411',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202411apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202411apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'isbc202411apicm',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapiref202411',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202411apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202411apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'iscc202411apicm',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapiref202411',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202411apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202411apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'ispc202411apicm',
        },
      ],
    },
    {
      label: 'APD API Reference',
      items: [
        {
          label: 'API Reference',
          docId: 'apdmaindoc',
        },
      ],
    },
    {
      label: 'Cloud Console',
      items: [
        {
          label: 'Build Promoter API',
          docId: 'buildpromoterapidocs',
        },
        {
          label: 'CI/CD Manager API',
          docId: 'cicdmanagerapiref',
        },
        {
          label: 'Database API',
          docId: 'dbserviceapi',
        },
        {
          label: 'EnterpriseEngage Deployments API',
          docId: 'eedeploymentsapi',
        },
        {
          label: 'IS Deployments API',
          docId: 'cloudconsoleapi',
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
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'API Reference',
          docId: 'in20243apiref',
        },
        {
          label: 'API Usage Scenarios',
          docId: 'in20243apiusage',
        },
      ],
    },
    {
      label: 'Integration Framework',
      items: [
        {
          label: 'Webhooks API Reference',
          docId: 'webhooksapinext',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/apiReferences/laslenas')({
  component: Kufri,
});

function Kufri() {
  return <CategoryLayout {...pageConfig} />;
}
