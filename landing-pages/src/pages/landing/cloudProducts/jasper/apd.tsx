import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import workflowImage from '../../img/conceptualize-visualize-finalize.png';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const apdJasperReleaseNotes: LandingPageItemProps = {
  label: 'Release notes',
  docId: 'apdapprnjasper',
};

const pageConfig: ApplicationLayoutProps = {
  title: 'Advanced Product Designer',
  buttonProps: apdJasperReleaseNotes,
  heroDescription: (
    <>
      Advanced Product Designer (APD) accelerates product design to enable
      insurers to quickly launch new product lines and adapt to changing market
      demands.
    </>
  ),
  videoSectionProps: {
    title: 'Learn  about Advanced Product Designer (APD)',
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
    videoUrl:
      'https://www.youtube-nocookie.com/embed/IrTP7677PQQ?si=OcnJ-DRAColM-L-g',
  },
  cards: [
    {
      cardId: 'get-started',
      cardTitle: 'Get started',
      items: [
        {
          label: 'Learn about APD',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'topics/c_intro.html',
        },
        {
          label: 'Request to enable APD',
          docId: 'apdfinalizingproductsjasper',
          pathInDoc: 'topics/c_request-enable-apd-app.html',
        },
        {
          label: 'Select a workset',
          docId: 'apdfinalizingproductsjasper',
          pathInDoc: 'topics/c_select-workset.html',
        },
        {
          label: 'Add Guidewire markers',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'working-with-xmind.html',
        },
        {
          label: 'Glossary',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'topics/c_glossary.html',
        },
      ],
    },
    {
      cardId: 'build',
      cardTitle: 'Build insurance products',
      items: [
        {
          label: 'Conceptualize products',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'topics/c_visualize.html',
        },
        {
          label: 'Localize products',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'view-localize-product.html',
        },
        {
          label: 'Create multi-line products',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'multilineproducts.html',
        },
        {
          label: 'Visualize products',
          docId: 'apdfinalizingproductsjasper',
          pathInDoc: 'topics/c_apd_visualize.html',
        },
        {
          label: 'Finalize products',
          docId: 'apdfinalizingproductsjasper',
          pathInDoc: 'topics/t_finalizing.html',
        },
      ],
    },
    {
      cardId: 'additional-references',
      cardTitle: 'Additional references',
      items: [
        {
          label: 'Vary insurance products over-time',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'topics/c_editions.html',
        },
        {
          label: 'Create customer segments',
          docId: 'apdcreatingproductsjasper',
          pathInDoc: 'product-seg.html',
        },
        {
          label: 'Frequently Asked Questions',
          docId: 'surepathmethodologymain',
          pathInDoc: 'general-guidance/lob',
        },
        {
          label: 'Guidebook',
          docId: 'surepathmethodologymain',
          pathInDoc: 'general-guidance/lob',
        },
      ],
    },
  ],
  resources: {
    title: 'Resources',
    items: [
      {
        label: 'Creating products with APD',
        docId: 'apdcreatingproductsjasper',
        pathInDoc: 'topics/c_landing-page.html',
      },
      {
        label: 'Integrating products with PolicyCenter',
        docId: 'apdfinalizingproductsjasper',
        pathInDoc: 'topics/c_finalizing-products-landing-page.html',
      },
      {
        label: 'API reference',
        docId: 'apdmaindoc',
      },
      apdJasperReleaseNotes,
      {
        label: 'Guidewire Education',
        url: 'https://education.guidewire.com/lmt/lmtlogin.prHome?site=guidewire',
      },
      {
        label: 'Guidewire Marketplace',
        url: 'https://marketplace.guidewire.com/',
      },
    ],
  },
  featureSections: [
    {
      left: (
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: '30px',
            }}
          >
            Build and Deploy Insurance Products
          </Typography>
          <Box sx={{ fontSize: '14px', lineHeight: '150%' }}>
            <p>With Advanced Product Designer, you can:</p>
            <ul>
              <li>
                <strong>Conceptualize</strong>: Define an insurance product,
                including coverages, exclusions, conditions, risk details, and
                other attributes
              </li>
              <li>
                <strong>Visualize</strong>: View and test the product
              </li>
              <li>
                <strong>Finalize</strong>: Generate and deploy the product
              </li>
            </ul>
          </Box>
        </Box>
      ),
      right: (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <img alt="" src={workflowImage} />
        </Box>
      ),
    },
  ],
  selector: {
    selectedItemLabel: 'Jasper (2024.02)',
    items: allSelectors.apdApp,
  },
};

export default function CreateHome() {
  return <ApplicationLayout {...pageConfig} />;
}
