import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-innsbruck.svg';

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
    selectedItemLabel: 'Innsbruck',
    items: allSelectors.s0f196c0b55cf55f2cdd1e05b1bf5e94e,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapirefinnsbruck',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202310apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202310apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'isbc202310apicm',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefinnsbruck',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202310apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202310apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'iscc202310apicm',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefinnsbruck',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202310apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202310apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'ispc202310apicm',
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
        {
          label: 'Database API',
          docId: 'dbserviceapi',
        },
      ],
    },
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'API Reference',
          docId: 'in20233apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20233portaldev',
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

export const Route = createFileRoute('/apiReferences/innsbruck')({
  component: Hakuba,
});

function Hakuba() {
  return <CategoryLayout {...pageConfig} />;
}
