import { createFileRoute } from '@tanstack/react-router';
import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Selecteer taal',
    selectedItemLabel: 'Nederlands',
    items: allSelectors.sfa48f3b641ce1ec0fe00a60fefbb4192,
    labelColor: 'white',
  },

  items: [
    {
      label: 'ClaimCenter',
      pagePath: 'l10n/nl-NL/cc',
    },
  ],
};

export const Route = createFileRoute('/l10n/nl-NL/')({
  component: NlNL,
});

function NlNL() {
  return <ProductFamilyLayout {...pageConfig} />;
}
