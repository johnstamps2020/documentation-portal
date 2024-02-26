import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import workflowImage from '../img/ae-land-page-workflow.png';
import appEventsDiagram from '../images/ae-arch-diagram.png';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const appEventsGuide: LandingPageItemProps = {
  label: 'App Events Guide',
  docId: 'appeventsdev',
};

const pageConfig: ApplicationLayoutProps = {
  title: 'App Events',
  buttonProps: appEventsGuide,
  heroDescription: (
    <>
      App Events is a vital component of the Guidewire Integration Framework, 
      introducing a new approach to outbound integrations between InsuranceSuite 
      and external systems.
    </>
  ),
  videoSectionProps: {
   title: 'Learn about App Events',
   description: (
      <p>
        Utilizing App Events, downstream systems can effortlessly subscribe to specific 
        business events and receive near-real-time information without the need for extensive 
        coding efforts. 
        App Events offers support for two delivery mechanisms: Webhooks and Integration Gateway.

      </p>
    ),
   /* right: (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <img alt="" src={appEventsDiagram} />
        </Box>
      ),*/
    videoUrl:
      'https://www.youtube-nocookie.com/embed/IrTP7677PQQ?si=OcnJ-DRAColM-L-g',
  },
  cards: [
    {
      cardId: 'app-events',
      cardTitle: 'App Events',
      items: [
        {
          label: 'App Event structure',
          docId: 'appeventsdev',
          pathInDoc: '?contextid=app-events-structure',
        },
        {
          label: 'Getting started with App Events',
          docId: 'appeventsdev',
          pathInDoc: '?contextid=ae-get-started',
        },
        {
          label: 'Configuring custom events',
          docId: 'appeventsdev',
          pathInDoc: '?contextid=custom-events',
        },
        {
          label: 'Using App Events API',
          docId: 'appeventsdev',
          pathInDoc: '?contextid=c_api_overview',
        },
        {
          label: 'Initializing App Events for existing data',
          docId: 'appeventsdev',
          pathInDoc: '?contextid=c_synch_overview',
        },
        {
          label: 'App Events framework release notes',
          docId: 'appeventsdev',
          pathInDoc: '?contextid=c_app_events_rn',
        }
      ],
    },
    {
      cardId: 'webhooks',
      cardTitle: 'Webhooks',
      items: [
        {
          label: 'Learn about Webhooks',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=webhooks',
        },
        {
          label: 'Getting started with Webhooks',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=get-started-webhooks',
        },
        {
          label: 'Configure an InsuranceSuite subscription',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=config-subscr',
        },
        {
          label: 'Configure an endpoint',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=wh-config-endpoint',
        },
        {
          label: 'Configure auth',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=wh-config-auth',
        },
        {
          label: 'App Events Webhooks API',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=webhooks-api',
        },
        {
          label: 'App Events Webhooks release notes',
          docId: 'webhooksrelease',
          pathInDoc: '?contextid=c_webhooks_rn',
        }
      ],
    },
    {
      cardId: 'integration-gateway',
      cardTitle: 'Integration Gateway',
      items: [
        {
          label: 'Learn about Integration Gateway',
          docId: 'integgatewaydevlatest',
          pathInDoc: '?contextid=ig-overview',
        },
        {
          label: 'Getting started with integration development',
          docId: 'integgatewaydevlatest',
          pathInDoc: '?contextid=ig-get-started',
        },
        {
          label: 'Developing and testing integrations',
          docId: 'integgatewaydevlatest',
          pathInDoc:
            '?contextid=ig-dev-test',
        },
        {
          label: 'Using events',
          docId: 'integgatewaydevlatest',
          pathInDoc: '?contextid=ig-use-events',
        },
        {
          label: 'Deploying and administering integrations',
          docId: 'integgatewaydevlatest',
          pathInDoc: '?contextid=c_build_deploy_overview',
        },
        {
          label: 'Integration Gateway Release Notes',
          docId: 'integgatewaydevlatest',
          pathInDoc: '?contextid=c_ig_release_notes',
        },
      ],
    },
  ],
  resources: {
    title: 'Resources',
    items: [
      {
        label: 'Overview of integration with InsuranceSuite',
        docId: 'is202402integoverview',
      },
      {
        label: 'Cloud API Developer Guide',
        docId: 'ispc202402apica',
      },
      {
        label: 'REST API Client',
        docId: 'isrestapiclientguide',
      },
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
            Integration Framework Products
          </Typography>
          <Box sx={{ fontSize: '14px', lineHeight: '150%' }}>
            <p>With Integration Framework producsts, you can:</p>
            <ul>
              <li>
                <strong>Design</strong>: Choose an integration pattern, outline the integration logic, 
                and specify preferred products to use
              </li>
              <li>
                <strong>Develop</strong>: Develop and test the integration
              </li>
              <li>
                <strong>Deploy</strong>: Generate and deploy the integration
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
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.apdApp,
  },
};

export default function CreateHome() {
  return <ApplicationLayout {...pageConfig} />;
}
