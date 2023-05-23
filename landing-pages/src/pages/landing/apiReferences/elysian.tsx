import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import elysianBackgroundImage from 'images/background-elysian.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `url(${elysianBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select release',
    selectedItemLabel: 'Elysian',
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
          label: 'API Reference',
          docId: 'bcapirefelysian',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'isbc202205apibf',
        },
      ],
    },
    {
      label: 'ClaimCenter',
      items: [
        {
          label: 'API Reference',
          docId: 'ccapirefelysian',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'iscc202205apica',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'iscc202205apibf',
        },
      ],
    },
    {
      label: 'PolicyCenter',
      items: [
        {
          label: 'API Reference',
          docId: 'pcapirefelysian',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'ispc202205apica',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'ispc202205apibf',
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
      ],
    },
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'API Reference',
          docId: 'in20221apiref',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20221portaldev',
        },
      ],
    },
  ],
};

export default function Elysian() {
  return <CategoryLayout {...pageConfig} />;
}