import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ApplicationLayoutProps = {
  title: 'PolicyCenter for Guidewire Cloud 2023.10',
  buttonProps: {
    label: 'Release notes',
    docId: 'ispc202310releasenotes',
  },
  tabs: [
    {
      icon: 'get-started',
      title: 'Get started',
      items: [
        {
          label: 'PolicyCenter Release Notes',
          docId: 'ispc202310releasenotes',
          description: (
            <>Learn about changes in this release of PolicyCenter.</>
          ),
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
          description: (
            <>
              Learn about changes to the AppReader microservice, which performs
              optical character recognition of PDF documents.
            </>
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
          docId: 'ispc202310update',
          description: (
            <>
              Update your configuration and database from a previous cloud
              version to the current version.
            </>
          ),
        },
        {
          label: 'Developer setup',
          docId: 'ispc202310devsetup',
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
              for each release of PolicyCenter.
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
          label: 'PolicyCenter Application',
          docId: 'ispc202310app',
          description: (
            <>
              Introduces PolicyCenter, and describes features from a business
              perspective.
            </>
          ),
        },
        {
          label: 'Product Designer',
          docId: 'ispc202310pd',
          description: (
            <>
              Use Product Designer to configure Line of Business insurance
              products.
            </>
          ),
        },
        {
          label: 'Advanced Product Designer',
          docId: 'ispc202310apd',
          description: <>Design, simulate, and deploy insurance products.</>,
        },
        {
          label: 'Policy rates',
          docId: 'ispc202310app',
          pathInDoc: '?contextid=c_df1082048',
          description: (
            <>
              Learn how PolicyCenter generates quotes for policy transactions,
              such as submissions.
            </>
          ),
        },
        {
          label: 'Submission Intake',
          docId: 'submissionintake',
          description: <>Streamline submission creation in PolicyCenter.</>,
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
          docId: 'ispc202310config',
          description: (
            <>
              A technical overview of InsuranceSuite configuration features and
              documentation.
            </>
          ),
        },

        {
          label: 'Gosu rules',
          docId: 'ispc202310rules',
          description: (
            <>
              Configure the Gosu rules that control basic functionality, such as
              validation, preupdate actions, and assignment.
            </>
          ),
        },

        {
          label: 'Product model configuration',
          docId: 'ispc202310pm',
          description: <>Describes the PolicyCenter product model.</>,
        },

        {
          label: 'Globalizing PolicyCenter',
          docId: 'ispc202310global',
          description: (
            <>Configure PolicyCenter functionality related to localization.</>
          ),
        },

        {
          label: 'Configuration parameter reference',
          description: (
            <>A reference of the application configuration parameters.</>
          ),
          docId: 'ispc202310config',
          pathInDoc: '?contextid=c_au6600343',
        },
        {
          label: 'Data model configuration',
          description: (
            <>
              Create and extend PolicyCenter data model entities and typelists.
            </>
          ),
          docId: 'ispc202310config',
          pathInDoc: '?contextid=c_pdatamodel',
        },

        {
          label: 'Configuration plugins',
          description: (
            <>
              Manage PolicyCenter predefined plugins to configure standard
              operations, such as policy number generation and quote purging.
            </>
          ),
          docId: 'ispc202310integ',
          pathInDoc: '?contextid=c_part-plugins',
        },

        {
          label: 'Workflow configuration',
          description: (
            <>
              Configure PolicyCenter workflows for management of complex
              business processes such as submissions and renewals.
            </>
          ),
          docId: 'ispc202310config',
          pathInDoc: '?contextid=p-workflow',
        },

        {
          label: 'PolicyCenter functionality configuration',
          description: (
            <>
              Configure PolicyCenter features (such as rating, quoting, and data
              destruction) to meet your business needs.
            </>
          ),
          docId: 'ispc202310config',
          pathInDoc: '?contextid=p-PolicyCenter',
        },

        {
          label: 'Gosu reference',
          docId: 'gosureflatest',
          description: <>A reference for the Gosu programming language. </>,
        },
        {
          label: 'User interface configuration',
          description: <>Configure the PolicyCenter user interface.</>,
          docId: 'ispc202310config',
          pathInDoc: '?contextid=p-ui-config',
        },

        {
          label: 'Search configuration',
          description: <>Configure search in PolicyCenter.</>,
          docId: 'ispc202310config',
          pathInDoc: '?contextid=c_all-fe3275213',
        },
        {
          label: 'Email configuration',
          description: (
            <>Configure PolicyCenter functionality related to sending email.</>
          ),
          docId: 'ispc202310config',
          pathInDoc: '?contextid=c_mx2909421',
        },
        {
          label: 'Jobs configuration',
          description: (
            <>Configure functionality related to PolicyCenter jobs.</>
          ),
          docId: 'ispc202310config',
          pathInDoc: '?contextid=p-PolicyCenter_jobs',
        },
        {
          label: 'Rating App (Early Access)',
          docId: 'ispc202310ratingapp',
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
          docId: 'ispc202310apica',
          description: (
            <>
              Configure inbound endpoint behavior, create new endpoints, and
              implement authentication in Cloud API.
            </>
          ),
        },
        {
          label: 'Integration Data Manager',
          docId: 'ispc202310integdatamgr',
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
          docId: 'ispc202310integ',
          pathInDoc: '?contextid=c_part-datatransfer',
        },
        {
          label: 'Messaging',
          description: (
            <>
              Use Guidewire messaging to send outbound messages asynchronously
              in response to specific PolicyCenter business events (such as
              account creation), and manage responses.
            </>
          ),
          docId: 'ispc202310integ',
          pathInDoc: '?contextid=c_part-messaging',
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
          docId: 'ispc202310integ',
          pathInDoc: '?contextid=c_ns2380296',
        },
        {
          label: 'Application events',
          docId: 'appeventsdev',
          description: (
            <>
              Use application events to send outbound messages asynchronously in
              response to specific PolicyCenter business events (such as account
              creation), and manage responses.
            </>
          ),
        },
        {
          label: 'Cloud API reference',
          docId: 'pcapirefinnsbruck',
          description: <>The API definitions for Cloud API for PolicyCenter.</>,
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202310restapifw',
          description: (
            <>
              Create custom inbound RESTful APIs for business requirements that
              are not addressed in Cloud API.
            </>
          ),
        },
        {
          label: 'SOAP APIs',
          docId: 'ispc202310integ',
          description: (
            <>
              Use the base configuration SOAP APIs that PolicyCenter publishes,
              publish custom SOAP APIs, and consume third-party SOAP APIs.
            </>
          ),
        },
        {
          label: 'Cloud API Consumer Guide',
          docId: 'ispc202310apibf',
          description: (
            <>
              Use Cloud API to make inbound calls from third-party applications
              that create, edit, and retrieve data from PolicyCenter.
            </>
          ),
        },
        {
          label: 'Cloud API for ContactManager',
          docId: 'ispc202310apicm',
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
          label: 'Pre-built integrations',
          description: (
            <>
              Implement pre-built functionality for PolicyCenter integration
              points, including rating integration, reinsurance, and forms
              inference.
            </>
          ),
          docId: 'ispc202310integ',
          pathInDoc: '?contextid=c_part-policy-integrations',
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
        {
          label: 'Cloud Integration Basics Course',
          description: (
            <>A self-paced course covering the basics of Cloud Integration</>
          ),
          docId: 'cloudintegrationbasics',
        },
      ],
    },
    {
      icon: 'administer',
      title: 'Administer',
      items: [
        {
          label: 'Administration overview',
          docId: 'ispc202310admin',
          description: (
            <>
              Manage security, backups, logging, user data, and more for a
              PolicyCenter system.
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
          docId: 'ispc202310admin',
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
          docId: 'ispc202310dataarchiving',
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
          docId: 'ispc202310admin',
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
          docId: 'ispc202310admin',
          pathInDoc: '?contextid=p_server',
        },
        {
          label: 'Business rules',
          description: (
            <>Create, edit, and manage underwriting issues in PolicyCenter.</>
          ),
          docId: 'ispc202310admin',
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
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.s1793805ac84baf801d4eb31b00ab1ddf,
    labelColor: 'black',
  },
};

export default function LandingPage202310() {
  return <ApplicationLayout {...pageConfig} />;
}
