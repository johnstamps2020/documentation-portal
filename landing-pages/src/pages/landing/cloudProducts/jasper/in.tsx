import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: ApplicationLayoutProps = {
  title: 'InsuranceNow 2024.1',
  buttonProps: {
    label: 'Release notes',
    docId: 'in20241rn',
  },
  heroDescription:
    'Guidewire InsuranceNow is a cloud-based platform for insurers that need a unified, ready-to-use solution with core, digital, data, analytics, and integrations.',
  tabs: [
    {
      id: 'inow_getstarted_tab',
      icon: 'get-started',
      title: 'Get started',
      items: [
        {
          label: 'Core Release Notes',
          docId: 'in20241rn',
          description: (
            <>
              Discover new features, recent improvements, and resolved issues in
              InsuranceNow core.
            </>
          ),
        },
        {
          label: 'Release Video',
          videoIcon: true,
          url: 'https://www.brainshark.com/guidewire/InsuranceNowInnsbruck',
          description: (
            <>Watch a video that describes and demonstrates new features.</>
          ),
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20241studiorn',
          description: (
            <>
              Discover new features, recent improvements, and resolved issues in
              InsuranceNow Studio.
            </>
          ),
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20241rn',
          description: (
            <>
              Discover new features, recent improvements, and resolved issues in
              the Consumer Service Portal.
            </>
          ),
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
          description: (
            <>
              Explore new features, recent improvements, and resolved issues in
              AppReader.
            </>
          ),
        },
        {
          label: 'Data Service Release Notes',
          docId: 'indataservicereleasenotes',
          description: (
            <>
              Explore new features, recent improvements, and resolved issues in
              the Data Service micro service.
            </>
          ),
        },
        {
          label: 'Upgrade InsuranceNow core',
          docId: 'in20241rn',
          pathInDoc: '?contextid=c_2024_1_x_jasper_upgrade_steps',
          description: <>Upgrade to a new release of InsuranceNow core.</>,
        },
        {
          label: 'Get started with GWCP',
          docId: 'ingwcpops',
          pathInDoc: '?contextid=c_getting_started',
          description: (
            <>
              Understand the tools and technology to deploy and operate
              InsuranceNow in the Guidewire Cloud.
            </>
          ),
        },
        {
          label: 'Get started with InsuranceNow',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_applications-getting-started',
          description: (
            <>Get acquainted with the InsuranceNow interface and login steps.</>
          ),
        },
        {
          label: 'Developer Setup',
          docId: 'indevguidejava11ext',
          description: (
            <>Set up a local InsuranceNow development environment.</>
          ),
        },
        {
          label: 'Upgrade Tool (Internal)',
          docId: 'inupgradetoolsdraft',
          description: (
            <>Upgrade an InsuranceNow build-out using the Upgrade Tool.</>
          ),
        },
        {
          label: 'Install Assist (Internal)',
          docId: 'ininstallassistdraft',
          description: (
            <>
              Configure and deploy InsuranceNow in a self-managed Linux platform
              hosted on Guidewire Cloud Classic.
            </>
          ),
        },
        {
          label: 'Developer Setup (Internal)',
          docId: 'indevguidejava11draft',
          description: (
            <>
              Set up a local InsuranceNow development environment, with specific
              instructions for users within Guidewire.
            </>
          ),
        },
      ],
    },
    {
      id: 'inow_learnabout_tab',
      icon: 'learn-about',
      title: 'Learn about',
      items: [
        {
          label: 'Quotes and policies',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_QuotePolicyProcessing_overview',
          description: <>Create quotes, applications, and policies.</>,
        },
        {
          label: 'Loss notices and claims',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_Claims_overview',
          description: (
            <>Process loss notices, claims, and claims transactions.</>
          ),
        },
        {
          label: 'Billing',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_Billing_overview',
          description: <>Process various billing scenarios.</>,
        },
        {
          label: 'Commissions',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_CommissionProcessing_overview',
          description: <>Define, manage, and process commissions.</>,
        },
        {
          label: 'Work items',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_ActionItemsandStorageOverview',
          description: <>View, organize, and share your work.</>,
        },
        {
          label: 'Payments',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_Payables_overview',
          description: <>Process outgoing payments.</>,
        },
        {
          label: 'GWCP operations',
          docId: 'ingwcpops',
          pathInDoc: '?contextid=c_overview',
          description: (
            <>
              Use the Guidewire Cloud Platform (GWCP) to deploy and operate
              InsuranceNow.
            </>
          ),
        },
        {
          label: 'Loss notices and claims',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_Claims_overview',
          description: (
            <>Process loss notices, claims, and claims transactions.</>
          ),
        },
        {
          label: 'Business Intelligence dashboards',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_reports_business_intelligence',
          description: (
            <>
              View dashboards that include groupings of reports that present
              users with information relevant to their role in the company.
            </>
          ),
        },
        {
          label: 'Business Intelligence reports',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_reports_business_intelligence',
          description: (
            <>
              View, explore, download, and share specially designed reports,
              built by Looker, from within InsuranceNow.
            </>
          ),
        },
        {
          label: 'InsuranceNow reports',
          docId: 'in20241app',
          pathInDoc: '??contextid=c_InsuranceNow_Reports',
          description: (
            <>
              View static reports for various business functions in
              InsuranceNow.
            </>
          ),
        },
        {
          label: 'Consumer Sales Portal',
          docId: 'in20241csalesp',
          pathInDoc: '?contextid=SalesPortalIntro',
          description: (
            <>
              Discover features and functionality available with the Consumer
              Sales Portal.
            </>
          ),
        },
        {
          label: 'Consumer Service Portal',
          docId: 'in20241xcservicepfeatures',
          pathInDoc: '?contextid=c_cspfeatures',
          description: (
            <>
              Discover the features and functionality available with the
              Consumer Service Portal.
            </>
          ),
        },
        {
          label: 'Data Service',
          docId: 'in2024dataservice',
          pathInDoc: '?contextid=ds_purpose_and_functionality',
          description: (
            <>
              Read about how Data Service jobs read and transform data from the
              core system to create content for reports.
            </>
          ),
        },
      ],
    },
    {
      id: 'inow_configure_tab',
      icon: 'configure',
      title: 'Configure',
      items: [
        {
          label: 'Core',
          docId: 'in20241config',
          description: <>Implement core features and integrations.</>,
        },
        {
          label: 'Underwriting',
          description: (
            <>
              Implement application, quote, and policy workflows for your lines
              of business.
            </>
          ),
          docId: 'in20241uwconfig',
        },
        {
          label: 'Claims',
          description: <>Set up InsuranceNow to process claims.</>,
          docId: 'in20241claimsconfig',
        },
        {
          label: 'Billing',
          description: (
            <>Implement billing with your organization's requirements.</>
          ),
          docId: 'in20241billref',
        },
        {
          label: 'Rules',
          description: <>Validate data that is entered into the application.</>,
          docId: 'in20241config',
          pathInDoc: '?contextid=c_InsuranceNowRules',
        },
        {
          label: 'Email and SMS',
          description: (
            <>Implement email (IMAP with OAuth 2.0) and SMS services.</>
          ),
          docId: 'in20241config',
          pathInDoc: '?contextid=c_configuring_email_with_insurancenow',
        },
        {
          label: 'Payments',
          description: <>Implement inbound/outbound payments and printing.</>,
          docId: 'in20241config',
          pathInDoc: '?contextid=c_payments',
        },
        {
          label: 'InsuranceNow Studio',
          description: <>Interactively modify and create lines of business.</>,
          docId: 'in20241studio',
        },
        {
          label: 'Excel Designed Rating',
          description: (
            <>
              Use Microsoft Excel workbooks to maintain product rates in
              policies.
            </>
          ),
          docId: 'inexcelrating30',
        },
        {
          label: 'Product Attribute Reference',
          description: (
            <>Define metadata in the product model to build the UI.</>
          ),
          docId: 'in20241prodattref',
        },
        {
          label: 'Consumer Service Portal Configuration (Internal)',
          description: (
            <>
              Implement a self-service solution tailored for each company's
              specific business needs.
            </>
          ),
          docId: 'in20241xcservicepconfigdraft',
        },
        {
          label: 'Consumer Sales Portal Configuration (Internal)',
          description: (
            <>
              Implement build-out-specific configurations that differ from the
              base configuration.
            </>
          ),
          docId: 'in20241xcsalespconfigdraft',
        },
      ],
    },
    {
      id: 'inow_integrate_tab',
      icon: 'integrate',
      title: 'Integrate',
      items: [
        {
          label: 'Core authentication',
          docId: 'in20241config',
          pathInDoc: '?contextid=c_authentication_methods',
          description: (
            <>
              Set up authentication for user access to the InsuranceNow
              application and database.
            </>
          ),
        },
        {
          label: 'Service Portal authentication',
          docId: 'in20241portaldev',
          pathInDoc: '?contextid=c_Consumer_Service_Portal_Authentication',
          description: <>Set up authentication for Service Portal users.</>,
        },
        {
          label: 'API authentication',
          docId: 'in20241portaldev',
          pathInDoc: '?contextid=c_v5-authentication',
          description: <>Set up authentication to use APIs.</>,
        },
        {
          label: 'Portal development',
          docId: 'in20241portaldev',
          pathInDoc: '?contextid=c_overview_portal_development',
          description: (
            <>Develop a sales, service, or agent portal using API endpoints.</>
          ),
        },
        {
          label: 'API reference',
          docId: 'in20241apiref',
          description: (
            <>
              Examine InsuranceNow APIs across several functional areas like
              policy, claims, and billing.
            </>
          ),
        },
        {
          label: 'Programming standards',
          docId: 'inprogstandards',
          pathInDoc: '?contextid=c_prog_standards_introduction',
          description: (
            <>
              Learn about standards and best practices for developing
              InsuranceNow projects.
            </>
          ),
        },
        {
          label: 'AppReader integration',
          docId: 'in20241appreaderinteg',
          pathInDoc: '?contextid=c_AppReaderOverview',
          description: (
            <>
              Integrate with AppReader to upload data from ACORD forms into
              quotes and applications.
            </>
          ),
        },
        {
          label: 'Custom API development',
          description: <>Learn about guidelines for custom API development.</>,
          docId: 'inapidevelopment',
          pathInDoc: '?contextid=c_custom_api_development',
        },
        {
          label: 'API modernization',
          docId: 'inapimodernization',
          pathInDoc: '?contextid=c_legacyapi_to_v5',
          description: <>Review the mapping from API version 2 to version 5.</>,
        },
      ],
    },
    {
      id: 'inow_admin_tab',
      icon: 'administer',
      title: 'Administer',
      items: [
        {
          label: 'Authority attributes and security',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_authority_attributes_security',
          description: (
            <>View and manage user authority and security permissions.</>
          ),
        },
        {
          label: 'Manage users',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_user_management',
          description: <>Add new users and manage existing users.</>,
        },
        {
          label: 'Manage Looker users and reports',
          docId: 'in20241app',
          pathInDoc: '?contextid=manage_looker_users_and_reports',
          description: (
            <>
              View, edit, and add Looker users. Audit Looker license usage;
              create, publish, and assign static looks.
            </>
          ),
        },
        {
          label: 'Manage Data Service',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_data_service_dashboard',
          description: (
            <>
              Access the Data Service console to view the status and take action
              on the Data Service. View dashboards related to balancing and
              error information.
            </>
          ),
        },
        {
          label: 'Run batch jobs',
          docId: 'in20241app',
          pathInDoc: '?contextid=c_BatchJobs',
          description: <>Run and view the status of batch jobs.</>,
        },
      ],
    },
  ],
  selector: {
    selectedItemLabel: 'Jasper (2024.1)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20241() {
  return <ApplicationLayout {...pageConfig} />;
}
