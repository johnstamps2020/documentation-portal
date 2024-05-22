import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-jasper.svg';

import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
    selectedItemLabel: 'Kufri',
    items: allSelectors.s0f196c0b55cf55f2cdd1e05b1bf5e94e,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'BillingCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'bcapirefkufri',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202407apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202407apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'isbc202407apicm',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefkufri',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202407apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'iscc202407apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'iscc202407apicm',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefkufri',
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202407apibf',
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202407apica',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'ispc202407apicm',
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
          docId: 'in20242apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20242portaldev',
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

export default function Kufri() {
  return <CategoryLayout {...pageConfig} />;
}
