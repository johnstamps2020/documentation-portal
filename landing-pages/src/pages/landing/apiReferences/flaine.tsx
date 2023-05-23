import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import flaineBadge from 'images/badge-flaine.svg';
import flaineBackgroundImage from 'images/background-flaine.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select release',
    selectedItemLabel: 'Flaine',
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
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapirefflaine',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202209apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202209apica',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefflaine',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202209apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202209apica',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefflaine',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202209apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202209apica',
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
          label: 'Cloud Console API',
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
          docId: 'in20222apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20222portaldev',
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

export default function Flaine() {
  return <CategoryLayout {...pageConfig} />;
}