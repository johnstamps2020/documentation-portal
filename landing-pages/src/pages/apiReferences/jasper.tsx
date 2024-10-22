import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-jasper.svg';

import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${backgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Jasper',
    items: allSelectors.s0f196c0b55cf55f2cdd1e05b1bf5e94e,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapirefjasper',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202402apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202402apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'isbc202402apicm',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefjasper',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202402apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202402apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'iscc202402apicm',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefjasper',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202402apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202402apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'ispc202402apicm',
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
          docId: 'in20241apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20241portaldev',
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

export const Route = createFileRoute('/apiReferences/jasper')({
  component: Hakuba,
});

function Hakuba() {
  return <CategoryLayout {...pageConfig} />;
}
