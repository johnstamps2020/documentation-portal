import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';

const getStartedItems = [
  {
    title: 'Overview of cloud administration',
    description:
      'A technical overview of InsuranceSuite cloud administration features and documentation.',
    url: '',
  },
  {
    title: 'Application configuration',
    description:
      'Configure application settings, such as the default currency, default locale, and default time zone.',
    url: '',
  },
  {
    title: 'Your day with PolicyCenter',
    description: 'Learn about the PolicyCenter application and how to use it.',
    url: '',
  },
  {
    title: 'Next-level relentless insurance platform',
    description:
      'PolicyCenter never slows down, never backs out of a deal and never keeps customers waiting. Its the relentless insurance platform that powers your success.',
    url: '',
  },
  {
    title: 'PolicyCenter release notes',
    description:
      'Learn about the new features and enhancements in the latest release of PolicyCenter.',
    url: '',
  },
  {
    title: 'PolicyCenter upgrade guide',
    description:
      'Learn about the new features and enhancements in the latest release of PolicyCenter.',
    url: '',
  },
  {
    title: 'PolicyCenter and your path to enlightenment',
    description:
      'Many have come here but not many have left. Is enlightenment synonymous with annihilation. Is enlightenment even possible? Find out in this guide.',
    url: '',
  },
  {
    title: 'Being and talking about being',
    description:
      'Can one really talk about being when they are not there? Take our 4-week tutorial and elevate your insurance game to the next level.',
    url: '',
  },
  {
    title: 'PolicyCenter and the art of motorcycle maintenance',
    description:
      'Learn how to maintain your motorcycle and your sanity at the same time.',
    url: '',
  },
];

const learnAboutItems = [
  {
    title: 'Create a sample application',
    description:
      'Create a sample application to learn about the Guidewire Cloud Platform (GWCP) and the InsuranceSuite applications.',
    url: '',
  },
  {
    title: 'Make changes to a sample application',
    description:
      'Make changes to a sample application to learn about the Guidewire Cloud Platform (GWCP) and the InsuranceSuite applications.',
    url: '',
  },
  {
    title: 'Use AI',
    description:
      'Use AI to automate tasks, such as identifying and extracting data from documents.',
    url: '',
  },
  {
    title: 'Use the Guidewire Cloud Platform (GWCP)',
    description:
      'Use the Guidewire Cloud Platform (GWCP) to manage your InsuranceSuite applications.',
    url: '',
  },
  {
    title: 'Use the Guidewire Cloud Platform (GWCP) APIs',
    description:
      'Use the Guidewire Cloud Platform (GWCP) APIs to manage your InsuranceSuite applications.',
    url: '',
  },
  {
    title:
      'Use the Guidewire Cloud Platform (GWCP) Command Line Interface (CLI)',
    description:
      'Use the Guidewire Cloud Platform (GWCP) CLI to manage your InsuranceSuite applications.',
    url: '',
  },
  {
    title: 'Use the Guidewire Cloud Platform (GWCP) UI',
    description:
      'Use the Guidewire Cloud Platform (GWCP) UI to manage your InsuranceSuite applications.',
    url: '',
  },
  {
    title: 'Manage multiple instances of an application',
    description:
      'Manage multiple instances of an application to learn about the Guidewire Cloud Platform (GWCP) and the InsuranceSuite applications.',
    url: '',
  },
  {
    title: 'Manage multiple instances of yourself',
    description: 'The only me is me. Are you sure the only you is you?',
    url: '',
  },
  {
    title: 'Learn proper nostalgia',
    description:
      'I like to think about the way we slept on rooftops in the summertime.',
    url: '',
  },
  {
    title: 'Learn about the Guidewire Cloud Platform (GWCP)',
    description:
      'Learn about the Guidewire Cloud Platform (GWCP) to manage your InsuranceSuite applications.',
    url: '',
  },
  {
    title: "Start an online business that doesn't do anything useful",
    description:
      "Learn how to start an online business that doesn't do anything useful.",
    url: '',
  },
  {
    title: "Learn to handle a three-year-old's temper tantrums",
    description:
      "Learn how to handle a three-year-old's temper tantrums without losing your mind. Or your temper. Or your three-year-old. Or your job. Or your house. Or your car. Or your dog. Or your cat. Or your goldfish. Or your sanity.",
    url: '',
  },
];

const configureItems = [
  {
    title: 'Configure application settings',
    description:
      'Configure application settings, such as the default currency, default locale, and default time zone.',
    url: '',
  },
  {
    title: 'Tasks',
    description:
      'Configure default tasks to define the tasks that are available to users.',
    url: '',
  },
  {
    title: 'Default users',
    description:
      'Configure default users to define the users that are available to perform tasks.',
    url: '',
  },
  {
    title: 'Roles and permissions',
    description:
      'Configure default roles to define the roles that are available to users.',
    url: '',
  },
  {
    title: 'Main groups',
    description:
      'Configure default groups to define the groups that are available to users.',
    url: '',
  },
  {
    title: 'Permissions 2: Electric Boogalo',
    description:
      'Configure default permissions to define the permissions that are available to users.',
    url: '',
  },
  {
    title: 'Organizations',
    description:
      'Configure default organizations to define the organizations that are available to users.',
    url: '',
  },
  {
    title: 'Locations, locations, locations',
    description:
      'Configure default locations to define the locations that are available to users. Locations are where things are.',
    url: '',
  },
  {
    title: 'Teams',
    description:
      'Configure default teams to define the teams that are available to users.',
    url: '',
  },
  {
    title: 'Queues',
    description:
      'Configure default queues to define the queues that are available to users. Out here, we tend to call them lines. But nobody cares about honest hard-working folks who live out here.',
    url: '',
  },
  {
    title: 'Work queues',
    description:
      'Configure default work queues to define the work queues that are available to users. These are lines you stand in to get a job for today. You do it every day. You do it for your family. You do it for your kids. You do it for your wife. You do it for your husband. You do it for your dog. You do it for your cat. You do it for your goldfish. You do it for your sanity.',
    url: '',
  },
  {
    title: 'Work queue groups',
    description:
      'Configure default work queue groups to define the work queue groups that are available to users. They form when people in line start talking.',
    url: '',
  },
  {
    title: 'Work queue assignments',
    description:
      'Configure default work queue assignments to define the work queue assignments that are available to users. Do work while you wait to get a job for the day. It saves someone time and money.',
    url: '',
  },
  {
    title: 'Configure magpies and crows',
    description:
      'Configure magpies and crows to define the magpies and crows that are available to users, loser, and cruisers.',
    url: '',
  },
];

const integrateItems = [
  {
    title: 'Overview of cloud integration',
    description:
      'A technical overview of InsuranceSuite cloud integration features and documentation.',
    url: '',
  },
  {
    title: 'REST API Client',
    description:
      'Use REST API Client to make outbound HTTP calls to internal or third-party REST services.',
    url: '',
  },
  {
    title: 'Application events',
    description: (
      <>
        Use application events to send outbound messages asynchronously in
        response to specific GenericCenter business events (such as account
        creation), and manage response.'
      </>
    ),
    url: '',
  },
  {
    title: 'Cloud API Consumer Guide',
    description:
      'Use Cloud API to make inbound calls from third-party applications that create, edit, and retrieve data from GenericCenter.',
    url: '',
  },
  {
    title: 'Pre-built integrations',
    description: (
      <>
        Implement pre-built functionality for PolicyCenter integration points,
        including rating integration, reinsurance, and forms inference.
      </>
    ),
    url: '',
  },
  {
    title: 'Messaging',
    description: (
      <>
        USe Guidewire messaging to send outbound messages asynchronously in
        response to specific GenericCenter business events (such as account
        creation), and manage responses.
      </>
    ),
    url: '',
  },
  {
    title: 'Cloud API Developer guide',
    description:
      'Configure inbound endpoint behavior, create new endpoints, and implement authentication in Cloud API.',
    url: '',
  },
  {
    title: 'Startable plugins',
    description:
      'Configure startable plugins that listen for and process inbound asynchronous messages from third-party applications.',
    url: '',
  },
  {
    title: 'Cloud API reference',
    description: 'The API definitions for Cloud API for GenericCenter.',
    url: '',
  },
  {
    title: 'Cloud API for ContactManager',
    description:
      'Use Cloud API to make inbound calls from third-party applications that create, edit, and retrieve data from ContactManager.',
    url: '',
  },
  {
    title: 'Plugins',
    description:
      'Mange GenericCenter predefined plugins to configure internal application operations, such as number generation, authentication, and document management.',
    url: '',
  },
  {
    title: 'File-based integration',
    description:
      'Configure file-based integration for both inbound and outbound integration points.',
    url: '',
  },
  {
    title: 'Gosu Reference',
    description: 'A reference for the Gosu programming language.',
    url: '',
  },
  {
    title: 'Integration Gateway',
    description: (
      <>
        Use Integration Gateway to facilitate the process of creating new
        integration projects, developing the project implementation locally, and
        deploying projects to the Guidewire Cloud Platform (GWCP).
      </>
    ),
    url: '',
  },
  {
    title: 'REST API Framework',
    description:
      'Create custom inbound RESTful APIs for business requirements that are not addressed in Cloud API.',
    url: '',
  },
  {
    title: 'SOAP APIs',
    description:
      'Use the base configuration SOAP APIs that GenericCenter publishes, publish custom SOAP APIs, and consume third-party SOAP APIs.',
    url: '',
  },
];

const administerItems = [
  {
    title: 'Overview of cloud administration',
    description:
      'A technical overview of InsuranceSuite cloud administration features and documentation.',
    url: '',
  },
  {
    title: 'Application configuration',
    description:
      'Configure application settings, such as the default currency, default locale, and default time zone.',
    url: '',
  },
  {
    title: 'Application security',
    description:
      'Configure application security settings, such as password policies, user authentication, and user authorization.',
    url: '',
  },
  {
    title: 'Application settings',
    description:
      'Configure application settings, such as the default currency, default locale, and default time zone.',
    url: '',
  },
  {
    title: 'Authentication',
    description:
      'Configure authentication settings, such as password policies, user authentication, and user authorization.',
    url: '',
  },
  {
    title: 'Authorization',
    description:
      'Configure authorization settings, such as password policies, user authentication, and user authorization. Make your site secure by requiring a password to log in.',
    url: '',
  },
  {
    title: 'Batch processes',
    description:
      'Configure batch processes to run on a schedule or on demand. These processes can be used to perform tasks such as data imports, data exports, and data updates.',
    url: '',
  },
  {
    title: 'Business rules',
    description:
      'Configure business rules to define the business logic that is used to process data in GenericCenter. Business rules are used to validate data, calculate values, and perform other tasks.',
    url: '',
  },
  {
    title: 'Code management',
    description:
      'Configure code management to manage the code that is used to customize GenericCenter.',
    url: '',
  },
  {
    title: 'Administer medication',
    description:
      'Little bottles with colorful liquids and happy rattly pill of different shapes and sizes. Tiny little bottles, seem harmless, and they probably are. I keep some in my bag, just in case. I have some in my pockets wherever I go.',
    url: '',
  },
];

const pageConfig: ApplicationLayoutProps = {
  tabs: [
    {
      icon: 'get-started',
      title: 'Get started',
      items: getStartedItems,
    },
    {
      icon: 'learn-about',
      title: 'Learn about',
      items: learnAboutItems,
    },
    {
      icon: 'configure',
      title: 'Configure',
      items: configureItems,
    },
    {
      icon: 'integrate',
      title: 'Integrate',
      items: integrateItems,
    },
    {
      icon: 'administer',
      title: 'Administer',
      items: administerItems,
    },
  ],
};

export default function PolicyCenterPrototype() {
  return <ApplicationLayout {...pageConfig} />;
}
