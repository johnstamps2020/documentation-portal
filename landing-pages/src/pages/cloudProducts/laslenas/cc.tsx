import { createFileRoute } from '@tanstack/react-router';
import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { allSelectors } from 'components/allSelectors';

const pageConfig: ApplicationLayoutProps = {
  title: 'ClaimCenter for Guidewire Cloud 2024.11',
  buttonProps: {
    label: 'Release notes',
    docId: 'isrnlatestpreview',
  },
  heroDescription:
    'Guidewire ClaimCenter manages the process of reporting, verifying, and making payments on claims against policies.',
  tabs: [
    {
      id: 'get-started',
      icon: 'get-started',
      title: 'Get started',
      items: [
        {
          label: 'ClaimCenter Release Notes',
          docId: 'isrnlatestpreview',
          description: <>Learn about changes in this release of ClaimCenter.</>,
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
          docId: 'iscc202411update',
          description: (
            <>
              Update your configuration and database from a previous cloud
              version to the current version.
            </>
          ),
        },
        {
          label: 'Release names and numbers',
          docId: 'isrnlatest',
          pathInDoc: '?contextid=is-release-name-mappings',
          description: (
            <>
              View a mapping between InsuranceSuite release names and release
              numbers.
            </>
          ),
        },
        {
          label: 'Upgrade tools',
          docId: 'isconfigupgradetools530',
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
        {
          label: 'Developer setup',
          docId: 'iscc202411devsetup',
          description: <>Set up your local development environment.</>,
        },
        {
          label: 'Claim Migration Tool',
          docId: 'claimmigrationtool',
          description: (
            <>Migrate claims from any system of record to ClaimCenter Cloud.</>
          ),
        },
        {
          label: 'Contact and Vendor Migration Tool',
          docId: 'contactvendormigrationtool',
          description: (
            <>
              Migrate contacts from a legacy system of record to Guidewire
              ContactManager.
            </>
          ),
        },
        {
          label: 'Data Upload Tool',
          docId: 'datauploadtool',
          description: (
            <>
              Migrate data from an on-premise Database Input Interface to
              Guidewire Cloud
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
          label: 'ClaimCenter Application',
          docId: 'iscc202411app',
          description: (
            <>
              Introduces ClaimCenter, and describes features from a business
              perspective.
            </>
          ),
        },
        {
          label: 'Contact Management',
          docId: 'is202411contact',
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
          label: 'Claims Intake: Personal Auto FNOL Template',
          docId: 'fnoltemplatemain',
          description: (
            <>
              Create a digital FNOL self-service flow for a first-party personal
              auto damage claim.
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
          docId: 'iscc202411config',
          description: (
            <>
              A technical overview of InsuranceSuite configuration features and
              documentation.
            </>
          ),
        },
        {
          label: 'ClaimCenter functionality configuration',
          description: (
            <>
              Configure ClaimCenter features (such as lines of business,
              services, and deductibles) to meet your business needs.
            </>
          ),
          docId: 'iscc202411config',
          pathInDoc: '?contextid=p-ClaimCenter',
        },
        {
          label: 'Configuration parameter reference',
          description: (
            <>A reference of the application configuration parameters.</>
          ),
          docId: 'iscc202411config',
          pathInDoc: '?contextid=c_au6600343',
        },
        {
          label: 'Data model configuration',
          description: (
            <>
              Create and extend ClaimCenter data model entities and typelists.
            </>
          ),
          docId: 'iscc202411config',
          pathInDoc: '?contextid=c_pdatamodel',
        },
        {
          label: 'User interface configuration',
          description: <>Configure the ClaimCenter user interface.</>,
          docId: 'iscc202411config',
          pathInDoc: '?contextid=p-ui-config',
        },
        {
          label: 'Gosu rules',
          docId: 'iscc202411rules',
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
              Manage ClaimCenter predefined plugins to configure standard
              operations, such as generating a new claim number.
            </>
          ),
          docId: 'iscc202411integ',
          pathInDoc: '?contextid=c_part-plugins',
        },
        {
          label: 'Globalizing ClaimCenter',
          docId: 'iscc202411global',
          description: (
            <>Configure ClaimCenter functionality related to localization.</>
          ),
        },
        {
          label: 'Gosu reference',
          docId: 'gosureflatest',
          description: <>A reference for the Gosu programming language. </>,
        },
        {
          label: 'Search configuration',
          description: <>Configure search in ClaimCenter.</>,
          docId: 'iscc202411config',
          pathInDoc: '?contextid=c_all-fe3275213',
        },
        {
          label: 'Email configuration',
          description: (
            <>Configure ClaimCenter functionality related to sending email.</>
          ),
          docId: 'iscc202411config',
          pathInDoc: '?contextid=c_mx2909421',
        },
        {
          label: 'Define activity patterns',
          description: (
            <>
              Configure ClaimCenter activity patterns that are used for
              activities.
            </>
          ),
          docId: 'iscc202411config',
          pathInDoc: '?contextid=c_eg2072244',
        },
        {
          label: 'Financials configuration',
          description: (
            <>
              Configure ClaimCenter financials functionality, such as reserves,
              payments, checks, and transactions.
            </>
          ),
          docId: 'iscc202411config',
          pathInDoc: '?contextid=c_xn1012431',
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
          docId: 'is202411integoverview',
          description: (
            <>
              A technical overview of InsuranceSuite cloud integration features
              and documentation.
            </>
          ),
        },
        {
          label: 'App Events',
          docId: 'appeventsdevnext',
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
          docId: 'webhooksnext',
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
          docId: 'iscc202411apibf',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from ClaimCenter.
            </>
          ),
        },
        {
          label: 'SOAP APIs',
          docId: 'iscc202411integ',
          pathInDoc: '?contextid=c_pwebservices',
          description: (
            <>
              Use the base configuration SOAP APIs that ClaimCenter publishes,
              publish custom SOAP APIs, and consume third-party SOAP APIs.
            </>
          ),
        },
        {
          label: 'Developing Integration Gateway Apps',
          docId: 'integgatewayfwnext',
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
          docId: 'integgatewayuinext',
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
          docId: 'iscc202411apica',
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
              Manage ClaimCenter predefined plugins to configure standard
              integration operations.
            </>
          ),
          docId: 'iscc202411integ',
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
          docId: 'ccapiref202411',
          description: <>The API definitions for Cloud API for ClaimCenter.</>,
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
          docId: 'iscc202411integ',
          pathInDoc: '?contextid=c_part-messaging',
        },
        {
          label: 'Claim and policy integrations',
          description: (
            <>
              Integrate with external systems, such as a policy administration
              system, to track claims on policies.
            </>
          ),
          docId: 'iscc202411integ',
          pathInDoc: '?contextid=c_part-claim-integrations',
        },
        {
          label: 'Integration Data Manager',
          docId: 'iscc202411integdatamgr',
          description: (
            <>
              Store third-party data for use with InsuranceSuite, view this
              data, and use it in business logic.
            </>
          ),
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'iscc202411apicm',
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
          docId: 'iscc202411integ',
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
          docId: 'iscc202411integ',
          pathInDoc: '?contextid=c_ns2380296',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202411restapifw',
          description: (
            <>
              Create custom inbound RESTful APIs for business requirements that
              are not addressed in Cloud API.
            </>
          ),
        },
        {
          label: 'API Sandbox',
          docId: 'is202411apisandbox',
          description: (
            <>
              Create a non-production development environment where you can
              explore a limited range of InsuranceSuite features.
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
          docId: 'iscc202411admin',
          description: (
            <>
              Manage ClaimCenter security, backups, logging, user data, and
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
          docId: 'iscc202411admin',
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
          docId: 'iscc202411dataarchiving',
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
          docId: 'iscc202411admin',
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
          docId: 'iscc202411admin',
          pathInDoc: '?contextid=p_server',
        },
        {
          label: 'Business rules',
          description: (
            <>
              Manage, administer, and import or export ClaimCenter business
              rules.
            </>
          ),
          docId: 'iscc202411admin',
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
    selectedItemLabel: 'Las Leñas (2024.11)',
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export const Route = createFileRoute('/cloudProducts/laslenas/cc')({
  component: LandingPage202411,
});

function LandingPage202411() {
  return <ApplicationLayout {...pageConfig} />;
}
