import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';

const pageConfig: ApplicationLayoutProps = {
  title: 'ClaimCenter for Guidewire Cloud 2023.10',
  buttonProps: {
    label: 'Release notes',
    docId: 'iscc202310releasenotes',
  },
  tabs: [
    {
      icon: 'get-started',
      title: 'Get started',
      items: [
        {
          label: 'ClaimCenter Release Notes',
          docId: 'iscc202310releasenotes',
          description: <>Learn about changes in this release of ClaimCenter.</>,
        },
        {
          label: 'Studio Release Notes',
          docId: 'isstudiolatestrn',
          description: <>Learn about changes to Guidewire Studio.</>,
        },
        {
          label: 'Update guide',
          docId: 'iscc202310update',
          description: (
            <>
              Update your configuration and database from a previous cloud
              version to the current version.
            </>
          ),
        },
        {
          label: 'Developer setup',
          docId: 'iscc202310devsetup',
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
              for each release of ClaimCenter.
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
          label: 'ClaimCenter Application',
          docId: 'iscc202310app',
          description: (
            <>
              Introduces ClaimCenter, and describes features from a business
              perspective.
            </>
          ),
        },
        {
          label: 'Claims Intake (Early Access)',
          docId: 'fnoltemplatemain',
          description: (
            <>
              Create a digital FNOL self-service flow for a first-party personal
              auto damage claim.
            </>
          ),
        },
        {
          label: 'Guidewire Rules (Early Access)',
          docId: 'gwrules',
          description: (
            <>
              Create and manage business rules that trigger when specific
              business conditions occur.
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
          docId: 'iscc202310config',
          description: (
            <>
              A technical overview of InsuranceSuite configuration features and
              documentation.
            </>
          ),
        },
        {
          label: 'Gosu rules',
          docId: 'iscc202310rules',
          description: (
            <>
              Configure the Gosu rules that control basic functionality, such as
              validation, preupdate actions, and assignment.
            </>
          ),
        },
        {
          label: 'Globalizing ClaimCenter',
          docId: 'iscc202310global',
          description: (
            <>Configure ClaimCenter functionality related to localization.</>
          ),
        },
        {
          label: 'Configuration parameter reference',
          description: (
            <>A reference of the application configuration parameters.</>
          ),
          url: '/cloud/cc/202310/config/?contextid=c_au6600343',
        },
        {
          label: 'Data model configuration',
          description: (
            <>
              Create and extend ClaimCenter data model entities and typelists.
            </>
          ),
          url: '/cloud/cc/202310/config/?contextid=c_pdatamodel',
        },
        {
          label: 'Configuration plugins',
          description: (
            <>
              Manage ClaimCenter predefined plugins to configure standard
              operations.
            </>
          ),
          url: '/cloud/cc/202310/integration/?contextid=c_part-plugins',
        },
        {
          label: 'Workflow configuration',
          description: (
            <>
              Configure ClaimCenter workflows for management of complex business
              processes.
            </>
          ),
          url: '/cloud/cc/202310/config/?contextid=p-workflow',
        },
        {
          label: 'ClaimCenter functionality configuration',
          description: (
            <>Configure ClaimCenter features to meet your business needs.</>
          ),
          url: '/cloud/cc/202310/config/?contextid=p-ClaimCenter',
        },
        {
          label: 'Gosu reference',
          docId: 'gosureflatest',
          description: <>A reference for the Gosu programming language. </>,
        },
        {
          label: 'User interface configuration',
          description: <>Configure the ClaimCenter user interface.</>,
          url: '/cloud/cc/202310/config/?contextid=p-ui-config',
        },
        {
          label: 'Search configuration',
          description: <>Configure search in ClaimCenter.</>,
          url: '/cloud/cc/202310/config/?contextid=c_all-fe3275213',
        },
        {
          label: 'Email configuration',
          description: (
            <>Configure ClaimCenter functionality related to sending email.</>
          ),
          url: '/cloud/cc/202310/config/?contextid=c_mx2909421',
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
          label: 'Cloud API Developer Guide',
          docId: 'iscc202310apica',
          description: (
            <>
              Configure inbound endpoint behavior, create new endpoints, and
              implement authentication in Cloud API.
            </>
          ),
        },
        {
          label: 'Integration Data Manager',
          docId: 'iscc202310integdatamgr',
          description: (
            <>
              Store third-party data for use with InsuranceSuite, view this
              data, and use it in business logic.
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
          url: '/cloud/cc/202310/integration/?contextid=c_part-datatransfer',
        },
        {
          label: 'Messaging',
          description: (
            <>
              Use Guidewire messaging to send outbound messages asynchronously
              in response to specific ClaimCenter business events and manage
              responses.
            </>
          ),
          url: '/cloud/cc/202310/integration/?contextid=c_part-messaging',
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
          label: 'Startable plugins',
          description: (
            <>
              Configure startable plugins that listen for and process inbound
              asynchronous messages from third-party applications.
            </>
          ),
          url: '/cloud/cc/202310/integration/?contextid=c_ns2380296',
        },
        {
          label: 'Application events',
          docId: 'appeventsdev',
          description: (
            <>
              Use application events to send outbound messages asynchronously in
              response to specific ClaimCenter business events and manage
              responses.
            </>
          ),
        },
        {
          label: 'Cloud API reference',
          docId: 'ccapirefinnsbruck',
          description: <>The API definitions for Cloud API for ClaimCenter.</>,
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202310restapifw',
          description: (
            <>
              Create custom inbound RESTful APIs for business requirements that
              are not addressed in Cloud API.
            </>
          ),
        },
        {
          label: 'SOAP APIs',
          docId: 'iscc202310integ',
          description: (
            <>
              Use the base configuration SOAP APIs that ClaimCenter publishes,
              publish custom SOAP APIs, and consume third-party SOAP APIs.
            </>
          ),
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'iscc202310apibf',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from ClaimCenter.
            </>
          ),
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'iscc202310apicm',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from ContactManager.
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
          label: 'Claim and Policy integrations',
          description: (
            <>Integrate with external systems to track claims on policies.</>
          ),
          url: '/cloud/cc/202310/integration/?contextid=c_part-claim-integrations',
        },
        {
          label: 'API Sandbox',
          docId: 'is202310apisandbox',
          description: (
            <>
              Create a non-production development environment where you can
              explore a limited range of InsuranceSuite features.
            </>
          ),
        },
      ],
    },
    {
      icon: 'administer',
      title: 'Administer',
      items: [
        {
          label: 'Administration overview',
          docId: 'iscc202310admin',
          description: (
            <>
              Manage security, backups, logging, user data, and more for a
              ClaimCenter system.
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
          url: '/cloud/cc/202310/admin/?contextid=p_security',
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
          docId: 'iscc202310dataarchiving',
          description: (
            <>
              Move the data associated with a claim from the active ClaimCenter
              database to a document storage area.
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
          url: '/cloud/cc/202310/admin/?contextid=p_data',
        },
        {
          label: 'Server administration',
          description: (
            <>
              Start and stop the application server, specify server modes and
              run levels, and manage server memory.
            </>
          ),
          url: '/cloud/cc/202310/admin/?contextid=p_server',
        },
        {
          label: 'Business rules',
          description: <>Create, edit, and manage activities in ClaimCenter.</>,
          url: '/cloud/cc/202310/admin/?contextid=p_bizrules',
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
};

export default function LandingPage202310() {
  return <ApplicationLayout {...pageConfig} />;
}
