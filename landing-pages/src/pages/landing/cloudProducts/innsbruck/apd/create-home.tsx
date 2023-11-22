import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';

const apdInnsbruckReleaseNotes: LandingPageItemProps = {
  label: 'Release notes',
  docId: 'apdapprninnsbruck',
};

const pageConfig: ApplicationLayoutProps = {
  title: 'Advanced Product Designer',
  buttonProps: apdInnsbruckReleaseNotes,
  videoSectionProps: {
    title: 'Advanced Product Designer',
    description: (
      <p>
        Advanced Product Designer is a cloud service for launching and updating
        insurance products. APD reduces implementation times by creating one
        source of product metadata and generating InsuranceSuite configuration,
        including APIs that are leveraged by integrations and digital
        experiences. Marketplace GO products include mind maps and XML templates
        that you can use to get started.
      </p>
    ),
  },
  cards: [
    {
      cardTitle: 'Get started',
      items: [
        {
          label: 'Learn about Advanced Product Designer App (APD)',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'topics/c_intro.html',
        },
        {
          label: 'Request to enable APD',
          docId: 'apdfinalizingproductsinnsbruck',
          pathInDoc: 'topics/c_request-enable-apd-app.html',
        },
        {
          label: 'Select a workset',
          docId: 'apdfinalizingproductsinnsbruck',
          pathInDoc: 'topics/c_select-workset.html',
        },
        {
          label: 'Add Guidewire markers',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'working-with-xmind.html',
        },
        {
          label: 'Glossary',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'topics/c_glossary.html',
        },
      ],
    },
    {
      cardTitle: 'Build insurance products',
      items: [
        {
          label: 'Conceptualize products',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'topics/c_visualize.html',
        },
        {
          label: 'Localize products',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'view-localize-product.html',
        },
        {
          label: 'Create multi-line products',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'multilineproducts.html',
        },
        {
          label: 'Visualize products',
          docId: 'apdfinalizingproductsinnsbruck',
          pathInDoc: 'topics/c_apd_visualize.html',
        },
        {
          label: 'Finalize products',
          docId: 'apdfinalizingproductsinnsbruck',
          pathInDoc: 'topics/t_finalizing.html',
        },
      ],
    },
    {
      cardTitle: 'Additional references',
      items: [
        {
          label: 'Vary insurance products over-time',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'topics/c_editions.html',
        },
        {
          label: 'Create customer segments',
          docId: 'apdcreatingproductsinnsbruck',
          pathInDoc: 'product-seg.html',
        },
        {
          label: 'Frequently Asked Questions',
          docId: 'cdsdocss3folder',
          pathInDoc:
            'FAQ_AdvancedProductDesignerForGuidewireImplementations.pdf',
        },
        {
          label: 'Product Adoption',
          docId: 'cdsdocss3folder',
          pathInDoc: 'Guidebook_AdvancedProductDesigner.pdf',
        },
      ],
    },
  ],
  resources: [
    {
      label: 'Creating products with APD',
      docId: 'apdcreatingproductsinnsbruck',
      pathInDoc: 'topics/c_landing-page.html',
    },
    {
      label: 'Integrating products with PolicyCenter',
      docId: 'apdfinalizingproductsinnsbruck',
      pathInDoc: 'topics/c_finalizing-products-landing-page.html',
    },
    {
      label: 'API reference',
      docId: 'apdmaindoc',
    },
    apdInnsbruckReleaseNotes,
    {
      label: 'Guidewire Education',
      pagePath:
        'https://education.guidewire.com/lmt/lmtlogin.prHome?site=guidewire',
    },
    {
      label: 'Guidewire Marketplace',
      pagePath: 'https://marketplace.guidewire.com/',
    },
  ],
};

export default function CreateHome() {
  return <ApplicationLayout {...pageConfig} />;
}
