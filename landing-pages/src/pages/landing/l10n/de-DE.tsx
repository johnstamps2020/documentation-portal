import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';
import { implementationResourcesSidebar } from '../common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Sprache wählen',
    selectedItemLabel: 'Deutsch',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'Was ist neu in Jasper',
      docId: 'whatsnewjasperdeDE',
    },
    {
      label: 'Was ist neu in Innsbruck',
      docId: 'whatsnewdeDEinnsbruck',
    },
    {
      label: 'Was ist neu in Hakuba',
      docId: 'whatsnewdeDEhakuba',
    },
    {
      label: 'Analytics',
      pagePath: 'l10n/de-DE/analytics',
    },
    {
      label: 'BillingCenter',
      pagePath: 'l10n/de-DE/bc',
    },
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/de-DE/cc',
    },
    {
      label: 'Cloud Platform',
      pagePath: 'l10n/de-DE/cp',
    },
    {
      label: 'CustomerEngage Account Management',
      pagePath: 'l10n/de-DE/ce-am',
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      pagePath: 'l10n/de-DE/ce-claims',
    },
    {
      label: 'CustomerEngage Quote and Buy',
      pagePath: 'l10n/de-DE/ce-qb',
    },
    {
      label: 'InsuranceSuite Contact Management',
      pagePath: 'l10n/de-DE/cm',
    },
    {
      label: 'InsuranceSuite Configuration Upgrade Tools',
      pagePath: 'l10n/de-DE/is-configupgradetools',
    },
    {
      label: 'PolicyCenter',
      pagePath: 'l10n/de-DE/pc',
    },
    {
      label: 'ProducerEngage',
      pagePath: 'l10n/de-DE/pe',
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      pagePath: 'l10n/de-DE/pe-claims',
    },
    {
      label: 'ServiceRepEngage',
      pagePath: 'l10n/de-DE/sre',
    },
    {
      label: 'VendorEngage',
      pagePath: 'l10n/de-DE/ve',
    },
  ],
};

export default function DeDE() {
  return <ProductFamilyLayout {...pageConfig} />;
}
