import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ApplicationLayoutProps = {
  title: 'BillingCenter for Guidewire Cloud 2023.10',
  buttonProps: {
    label: 'Release notes',
    docId: 'isbc202310releasenotes',
  },
  heroDescription:
    'Guidewire BillingCenter manages billing, payment, and delinquency operations for policies.',
  tabs: [
    {
      icon: 'get-started',
      title: 'Get started',
      items: [
        {
          label: 'BillingCenter Release Notes',
          docId: 'isbc202310releasenotes',
          description: (
            <>Learn about changes in this release of BillingCenter.</>
          ),
        },
        {
          label: 'Studio Release Notes',
          docId: 'isstudiolatestrn',
          description: (
            <>
              Learn about changes to Guidewire Studio, the administration tool
              for creating and managing InsuranceSuite resources.
            </>
          ),
        },
        {
          label: 'Update guide',
          docId: 'isbc202310update',
          description: (
            <>
              Update your configuration and database from a previous cloud
              version to the current version.
            </>
          ),
        },
        {
          label: 'Developer setup',
          docId: 'isbc202310devsetup',
          description: <>Set up your local development environment.</>,
        },
        {
          label: 'Upgrade tools',
          docId: 'isconfigupgradetools500',
          description: (
            <>
              Learn about the Guidewire InsuranceSuite configuration upgrade
              tools.
            </>
          ),
        },
        {
          label: 'Upgrade tools compatibility',
          docId: 'isupgradecompatibility',
          description: (
            <>
              Lists the versions of the configuration upgrade tools appropriate
              for each release of BillingCenter.
            </>
          ),
        },
      ],
    },
    {
      icon: 'learn-about',
      title: 'Learn about',
      items: [
        {
          label: 'BillingCenter Application',
          docId: 'isbc202310app',
          description: (
            <>
              Introduces BillingCenter, and describes features from a business
              perspective.
            </>
          ),
        },
        {
          label: 'Contact Management',
          docId: 'is202310contact',
          description: (
            <>
              Describes how to configure Guidewire InsuranceSuite applications
              to integrate with ContactManager, and how to manage client and
              vendor contacts in a single system of record.
            </>
          ),
        },
      ],
    },
    {
      icon: 'configure',
      title: 'Configure',
      items: [
        {
          label: 'Getting started with configuration',
          docId: 'isbc202310config',
          description: (
            <>
              A technical overview of InsuranceSuite configuration features and
              documentation.
            </>
          ),
        },

        {
          label: 'BillingCenter functionality configuration',
          description: (
            <>Configure BillingCenter features to meet your business needs.</>
          ),
          docId: 'isbc202310config',
          pathInDoc: '?contextid=p-BillingCenter',
        },
        {
          label: 'Configuration parameter reference',
          description: (
            <>A reference of the application configuration parameters.</>
          ),
          docId: 'isbc202310config',
          pathInDoc: '?contextid=c_au6600343',
        },
        {
          label: 'Data model configuration',
          description: (
            <>
              Create and extend BillingCenter data model entities and typelists.
            </>
          ),
          docId: 'isbc202310config',
          pathInDoc: '?contextid=c_pdatamodel',
        },
        {
          label: 'User interface configuration',
          description: <>Configure the BillingCenter user interface.</>,
          docId: 'isbc202310config',
          pathInDoc: '?contextid=p-ui-config',
        },
        {
          label: 'Gosu rules',
          docId: 'isbc202310rules',
          description: (
            <>
              Configure the Gosu rules that control basic functionality, such as
              validation, preupdate actions, and assignment.
            </>
          ),
        },
        {
          label: 'Plugins',
          description: (
            <>
              Manage BillingCenter predefined plugins to configure standard
              operations, such as account number generation and commission
              calculation.
            </>
          ),
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_part-plugins',
        },
        {
          label: 'Globalizing BillingCenter',
          docId: 'isbc202310global',
          description: (
            <>Configure BillingCenter functionality related to localization.</>
          ),
        },
        {
          label: 'Gosu reference',
          docId: 'gosureflatest',
          description: <>A reference for the Gosu programming language. </>,
        },
        {
          label: 'Search configuration',
          description: <>Configure search in BillingCenter.</>,
          docId: 'isbc202310config',
          pathInDoc: '?contextid=c_ff3710248',
        },
        {
          label: 'Workflow configuration',
          description: (
            <>
              Configure BillingCenter workflows for management of complex
              business processes.
            </>
          ),
          docId: 'isbc202310config',
          pathInDoc: '?contextid=p-workflow',
        },
        {
          label: 'Email configuration',
          description: (
            <>Configure BillingCenter functionality related to sending email.</>
          ),
          docId: 'isbc202310config',
          pathInDoc: '?contextid=c_mx2909421',
        },
        {
          label: 'Define activity patterns',
          description: (
            <>
              Manage BillingCenter predefined plugins to configure standard
              integration operations.
            </>
          ),
          docId: 'isbc202310config',
          pathInDoc: '?contextid=c_eg2072244',
        },
      ],
    },
    {
      icon: 'integrate',
      title: 'Integrate',
      items: [
        {
          label: 'Overview of cloud integration',
          docId: 'is202310integoverview',
          description: (
            <>
              A technical overview of InsuranceSuite cloud integration features
              and documentation.
            </>
          ),
        },
        {
          label: 'Application events',
          docId: 'appeventsdev',
          description: (
            <>
              Use application events to send outbound messages asynchronously,
              without the need for Gosu code, in response to specific business
              events and manage responses.
            </>
          ),
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'isbc202310apibf',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from BillingCenter.
            </>
          ),
        },
        {
          label: 'SOAP APIs',
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_pwebservices',
          description: (
            <>
              Use the base configuration SOAP APIs that BillingCenter publishes,
              publish custom SOAP APIs, and consume third-party SOAP APIs.
            </>
          ),
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
          description: (
            <>
              Use Integration Gateway to facilitate the process of creating new
              integration projects, developing the project implementation
              locally, and deploying projects to the Guidewire Cloud Platform
              (GWCP).
            </>
          ),
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'isbc202310apica',
          description: (
            <>
              Configure inbound endpoint behavior, create new endpoints, and
              implement authentication in Cloud API.
            </>
          ),
        },
        {
          label: 'Plugins',
          description: (
            <>
              Manage BillingCenter predefined plugins to configure standard
              integration operations.
            </>
          ),
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_part-plugins',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
          description: (
            <>
              Use REST API Client to make outbound HTTP calls to internal or
              third-party REST services.
            </>
          ),
        },
        {
          label: 'Cloud API reference',
          docId: 'bcapirefinnsbruck',
          description: (
            <>The API definitions for Cloud API for BillingCenter.</>
          ),
        },
        {
          label: 'Messaging',
          description: (
            <>
              Use traditional Guidewire messaging to configure Gosu rules and
              custom message transport plugins that send outbound messages
              asynchronously in response to specific business events and manage
              responses.
            </>
          ),
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_part-messaging',
        },
        {
          label: 'Billing and account integrations',
          description: (
            <>
              Integrate with external systems to import billing and account
              data.
            </>
          ),
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_ph1012431',
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'isbc202310apicm',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from ContactManager.
            </>
          ),
        },
        {
          label: 'File-based integration',
          description: (
            <>
              Configure filed-based integration for both inbound and outbound
              integration points.
            </>
          ),
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_part-datatransfer',
        },
        {
          label: 'Startable plugins',
          description: (
            <>
              Configure startable plugins that listen for and process inbound
              asynchronous messages from third-party applications.
            </>
          ),
          docId: 'isbc202310integ',
          pathInDoc: '?contextid=c_ns2380296',
        },
        {
          label: 'REST API Framework',
          docId: 'isbc202310restapifw',
          description: (
            <>
              Create custom inbound RESTful APIs for business requirements that
              are not addressed in Cloud API.
            </>
          ),
        },
        {
          label: 'Cloud Integration Basics Course',
          description: (
            <>A self-paced course covering the basics of Cloud Integration</>
          ),
          docId: 'cloudintegrationbasics',
        },
        {
          label: 'Gosu reference',
          docId: 'gosureflatest',
          description: <>A reference for the Gosu programming language. </>,
        },
      ],
    },
    {
      icon: 'administer',
      title: 'Administer',
      items: [
        {
          label: 'Administration overview',
          docId: 'isbc202310admin',
          description: (
            <>
              Manage security, backups, logging, user data, and more for a
              BillingCenter system.
            </>
          ),
        },
        {
          label: 'Cloud Console',
          docId: 'guidewirecloudconsolerootinsurerdev',
          description: (
            <>Access and manage your Guidewire Cloud applications.</>
          ),
        },
        {
          label: 'Authentication',
          docId: 'guidewireidentityfederationhub',
          description: (
            <>Authenticate and verify user access to Guidewire resources.</>
          ),
        },
        {
          label: 'Security',
          description: (
            <>
              Encrypt communications between security systems. Manage custom
              permissions.
            </>
          ),
          docId: 'isbc202310admin',
          pathInDoc: '?contextid=p_security',
        },
        {
          label: 'Network connectivity',
          docId: 'cloudplatformrelease',
          description: (
            <>
              Manage data transmission between your self-managed infrastructure
              and Guidewire Cloud.
            </>
          ),
        },
        {
          label: 'Data Archiving',
          docId: 'isbc202310dataarchiving',
          description: (
            <>
              Move the data associated with a closed policy period from the
              active BillingCenter database to a document storage area.
            </>
          ),
        },
        {
          label: 'Data masking',
          docId: 'datamasking',
          description: (
            <>
              Keep sensitive data secure. Access data for testing and debugging
              applications.
            </>
          ),
        },
        {
          label: 'Database administration',
          description: <>Manage and maintain your Guidewire databases.</>,
          docId: 'isbc202310admin',
          pathInDoc: '?contextid=p_data',
        },
        {
          label: 'Server administration',
          description: (
            <>
              Start and stop the application server, specify server modes and
              run levels, and manage server memory.
            </>
          ),
          docId: 'isbc202310admin',
          pathInDoc: '?contextid=p_server',
        },
        {
          label: 'Observability',
          docId: 'observability',
          description: (
            <>
              Observe system activity and logs. Diagnose performance issues for
              resolution.
            </>
          ),
        },
      ],
    },
  ],
  selector: {
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.s344cd6ac814e55dd2f6e1bddf2c969db,
    labelColor: 'black',
  },
};

export default function LandingPage202310() {
  return <ApplicationLayout {...pageConfig} />;
}
