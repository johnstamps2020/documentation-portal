import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ApplicationLayoutProps = {
  title: 'PolicyCenter for Guidewire Cloud 2024.02',
  buttonProps: {
    label: 'Release notes',
    docId: 'ispc202402releasenotes',
  },
  heroDescription:
    'Guidewire PolicyCenter provides underwriting and policy administration for personal and commercial line insurers in the property and casualty industry.',
  tabs: [
    {
      id: 'get-started',
      icon: 'get-started',
      title: 'Get started',
      items: [
        {
          label: 'PolicyCenter Release Notes',
          docId: 'ispc202402releasenotes',
          description: (
            <>Learn about changes in this release of PolicyCenter.</>
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
          docId: 'ispc202402update',
          description: (
            <>
              Update your configuration and database from a previous cloud
              version to the current version.
            </>
          ),
        },
        {
          label: 'Developer setup',
          docId: 'ispc202402devsetup',
          description: <>Set up your local development environment.</>,
        },
        {
          label: 'Upgrade tools',
          docId: 'isconfigupgradetools520',
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
              for each release of PolicyCenter.
            </>
          ),
        },
        {
          label: 'Policy History Migration Tool',
          docId: 'policyhistorymigrationtool',
          description: (
            <>
              Migrate policies from any system of record to PolicyCenter Cloud.
            </>
          ),
        },
      ],
    },
    {
      id: 'learn-about',
      icon: 'learn-about',
      title: 'Learn about',
      items: [
        {
          label: 'PolicyCenter Application',
          docId: 'ispc202402app',
          description: (
            <>
              Introduces PolicyCenter, and describes features from a business
              perspective.
            </>
          ),
        },
        {
          label: 'Contact Management',
          docId: 'is202402contact',
          description: (
            <>
              Describes how to configure Guidewire InsuranceSuite applications
              to integrate with ContactManager, and how to manage client and
              vendor contacts in a single system of record.
            </>
          ),
        },
        {
          label: 'Terminology and Naming Conventions',
          docId: 'cloudplatformtermrelease',
          description: (
            <>
              Terminology and naming conventions for Guidewire Cloud Platform
              resources.
            </>
          ),
        },
        {
          label: 'Product Designer',
          docId: 'ispc202402pd',
          description: (
            <>
              Use Product Designer to configure Line of Business insurance
              products.
            </>
          ),
        },
        {
          label: 'Advanced Product Designer',
          docId: 'ispc202402apd',
          description: <>Design, simulate, and deploy insurance products.</>,
        },
        {
          label: 'Policy rates',
          docId: 'ispc202402app',
          pathInDoc: '?contextid=c_df1082048',
          description: (
            <>
              Learn how PolicyCenter generates quotes for policy transactions,
              such as submissions.
            </>
          ),
        },
      ],
    },
    {
      id: 'configure',
      icon: 'configure',
      title: 'Configure',
      items: [
        {
          label: 'Getting started with configuration',
          docId: 'ispc202402config',
          description: (
            <>
              A technical overview of InsuranceSuite configuration features and
              documentation.
            </>
          ),
        },
        {
          label: 'PolicyCenter functionality configuration',
          description: (
            <>
              Configure PolicyCenter features (such as rating, quoting, and data
              destruction) to meet your business needs.
            </>
          ),
          docId: 'ispc202402config',
          pathInDoc: '?contextid=p-PolicyCenter',
        },
        {
          label: 'Configuration parameter reference',
          description: (
            <>A reference of the application configuration parameters.</>
          ),
          docId: 'ispc202402config',
          pathInDoc: '?contextid=c_au6600343',
        },
        {
          label: 'Data model configuration',
          description: (
            <>
              Create and extend PolicyCenter data model entities and typelists.
            </>
          ),
          docId: 'ispc202402config',
          pathInDoc: '?contextid=c_pdatamodel',
        },
        {
          label: 'User interface configuration',
          description: <>Configure the PolicyCenter user interface.</>,
          docId: 'ispc202402config',
          pathInDoc: '?contextid=p-ui-config',
        },
        {
          label: 'Gosu rules',
          docId: 'ispc202402rules',
          description: (
            <>
              Configure the Gosu rules that control basic functionality, such as
              validation, preupdate actions, and assignment.
            </>
          ),
        },
        {
          label: 'Guidewire Rules for PolicyCenter (Early Access)',
          docId: 'gwrulespc',
          description: (
            <>
              Create and manage business rules that trigger when specific
              business conditions occur in PolicyCenter.
            </>
          ),
        },
        {
          label: 'Guidewire Rules Type Manager (Early Access)',
          docId: 'gwrulestypemgr',
          description: <>Create and manage new rule types.</>,
        },
        {
          label: 'Plugins',
          description: (
            <>
              Manage PolicyCenter predefined plugins to configure standard
              operations, such as policy number generation and quote purging.
            </>
          ),
          docId: 'ispc202402integ',
          pathInDoc: '?contextid=c_part-plugins',
        },
        {
          label: 'Product model configuration',
          docId: 'ispc202402pm',
          description: <>Describes the PolicyCenter product model.</>,
        },
        {
          label: 'Globalizing PolicyCenter',
          docId: 'ispc202402global',
          description: (
            <>Configure PolicyCenter functionality related to localization.</>
          ),
        },
        {
          label: 'Gosu reference',
          docId: 'gosureflatest',
          description: <>A reference for the Gosu programming language. </>,
        },
        {
          label: 'Search configuration',
          description: <>Configure search in PolicyCenter.</>,
          docId: 'ispc202402config',
          pathInDoc: '?contextid=c_all-fe3275213',
        },
        {
          label: 'Workflow configuration',
          description: (
            <>
              Configure PolicyCenter workflows for management of complex
              business processes such as submissions and renewals.
            </>
          ),
          docId: 'ispc202402config',
          pathInDoc: '?contextid=p-workflow',
        },
        {
          label: 'Email configuration',
          description: (
            <>Configure PolicyCenter functionality related to sending email.</>
          ),
          docId: 'ispc202402config',
          pathInDoc: '?contextid=c_mx2909421',
        },
        {
          label: 'Jobs configuration',
          description: (
            <>Configure functionality related to PolicyCenter jobs.</>
          ),
          docId: 'ispc202402config',
          pathInDoc: '?contextid=p-PolicyCenter_jobs',
        },
        {
          label: 'Submission Intake',
          docId: 'submissionintake',
          description: <>Streamline submission creation in PolicyCenter.</>,
        },
        {
          label: 'Rating App (Early Access)',
          docId: 'ispc202402ratingapp',
          description: (
            <>
              Use the Rating SDK to develop artifacts that perform specific
              rating tasks or calculations in PolicyCenter.
            </>
          ),
        },
      ],
    },
    {
      id: 'integrate',
      icon: 'integrate',
      title: 'Integrate',
      items: [
        {
          label: 'Overview of cloud integration',
          docId: 'is202402integoverview',
          description: (
            <>
              A technical overview of InsuranceSuite cloud integration features
              and documentation.
            </>
          ),
        },
        {
          label: 'App Events',
          docId: 'appeventsdev',
          description: (
            <>
              Use App Events to send outbound messages asynchronously, without
              the need for Gosu code, in response to specific business events
              and manage responses.
            </>
          ),
        },
        {
          label: 'Webhooks',
          docId: 'webhooksrelease',
          description: (
            <>
              Webhooks enable customers to effortlessly subscribe external
              systems to application events occurring within the InsuranceSuite,
              facilitated by a user-friendly UI and API for subscription
              management.
            </>
          ),
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202402apibf',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from PolicyCenter.
            </>
          ),
        },
        {
          label: 'SOAP APIs',
          docId: 'ispc202402integ',
          pathInDoc: '?contextid=c_pwebservices',
          description: (
            <>
              Use the base configuration SOAP APIs that PolicyCenter publishes,
              publish custom SOAP APIs, and consume third-party SOAP APIs.
            </>
          ),
        },
        {
          label: 'Developing Integration Gateway Apps',
          docId: 'integgatewayfwjasperrelease',
          description: (
            <>
              Offers comprehensive guidance on leveraging the Integration
              Gateway framework library components and utilities. Provides
              detailed instructions and examples for creating new integration
              projects, refining project implementation, and configuring
              security authentication.
            </>
          ),
        },
        {
          label: 'Administering Integration Gateway Apps',
          docId: 'integgatewayuirelease',
          description: (
            <>
              Provides practical guidance on configuring access to the
              Integration Apps user interface, creating new integration apps,
              managing the integrations and their deployment to Guidewire Cloud.
              Offers information about observability metrics for monitoring
              their performance.
            </>
          ),
        },
        {
          label: 'Cloud API Developer Guide',
          docId: 'ispc202402apica',
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
              Manage PolicyCenter predefined plugins to configure standard
              integration operations.
            </>
          ),
          docId: 'ispc202402integ',
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
          docId: 'pcapirefjasper',
          description: <>The API definitions for Cloud API for PolicyCenter.</>,
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
          docId: 'ispc202402integ',
          pathInDoc: '?contextid=c_part-messaging',
        },
        {
          label: 'Pre-built integrations',
          description: (
            <>
              Implement pre-built functionality for PolicyCenter integration
              points, including rating integration, reinsurance, and forms
              inference.
            </>
          ),
          docId: 'ispc202402integ',
          pathInDoc: '?contextid=c_part-policy-integrations',
        },
        {
          label: 'Integration Data Manager',
          docId: 'ispc202402integdatamgr',
          description: (
            <>
              Store third-party data for use with InsuranceSuite, view this
              data, and use it in business logic.
            </>
          ),
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'ispc202402apicm',
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
          docId: 'ispc202402integ',
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
          docId: 'ispc202402integ',
          pathInDoc: '?contextid=c_ns2380296',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202402restapifw',
          description: (
            <>
              Create custom inbound RESTful APIs for business requirements that
              are not addressed in Cloud API.
            </>
          ),
        },
        {
          label: 'API Sandbox',
          docId: 'is202402apisandbox',
          description: (
            <>
              Create a non-production development environment where you can
              explore a limited range of InsuranceSuite features.
            </>
          ),
        },
        {
          label: 'AppReader',
          docId: 'appreader',
          description: (
            <>
              Use the AppReader API to extract data from ACORD forms and loss
              runs.
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
        {
          label: 'Business Functions (Early Access)',
          docId: 'businessfunctionsrelease',
          description: (
            <>
              A modern approach to implementing stateless, single-transaction
              business logic that caters to specific business needs. Positioned
              as a replacement for Gosu for coding business logic across various
              use cases, it prioritizes facilitating Experience APIs for the
              Jutro Digital Platform (JDP).
            </>
          ),
        },
      ],
    },
    {
      id: 'administer',
      icon: 'administer',
      title: 'Administer',
      items: [
        {
          label: 'Administration overview',
          docId: 'ispc202402admin',
          description: (
            <>
              Manage PolicyCenter security, backups, logging, user data, and
              more.
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
          docId: 'ispc202402admin',
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
          docId: 'ispc202402dataarchiving',
          description: (
            <>
              Move the data associated with a policy from the active
              PolicyCenter database to a document storage area.
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
          docId: 'ispc202402admin',
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
          docId: 'ispc202402admin',
          pathInDoc: '?contextid=p_server',
        },
        {
          label: 'Business rules',
          description: (
            <>
              Manage, administer, and import or export PolicyCenter business
              rules.
            </>
          ),
          docId: 'ispc202402admin',
          pathInDoc: '?contextid=p_bizrules',
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
    selectedItemLabel: 'Jasper (2024.02)',
    items: allSelectors.s1793805ac84baf801d4eb31b00ab1ddf,
    labelColor: 'black',
  },
};

export default function LandingPage202402() {
  return <ApplicationLayout {...pageConfig} />;
}
