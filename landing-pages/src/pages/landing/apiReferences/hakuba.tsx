import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import hakubaBackgroundImage from 'images/background-hakuba.svg';

import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${hakubaBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba',
    items: [
      {
        label: 'Banff',
        pagePath: 'apiReferences/banff',
      },
      {
        label: 'Cortina',
        pagePath: 'apiReferences/cortina',
      },
      {
        label: 'Dobson',
        pagePath: 'apiReferences/dobson',
      },
      {
        label: 'Elysian',
        pagePath: 'apiReferences/elysian',
      },
      {
        label: 'Flaine',
        pagePath: 'apiReferences/flaine',
      },
      {
        label: 'Garmisch',
        pagePath: 'apiReferences/garmisch',
      },
      {
        label: 'Hakuba',
        pagePath: 'apiReferences/hakuba',
      },
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapirefhakuba',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202306apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202306apica',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefhakuba',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202306apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202306apica',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefhakuba',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202306apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202306apica',
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
      ],
    },
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'API Reference',
          docId: 'in20232apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20232portaldev',
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

export default function Hakuba() {
  return <CategoryLayout {...pageConfig} />;
}
