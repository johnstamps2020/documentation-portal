import ApplicationLayout, {
  ApplicationLayoutProps,
} from 'components/LandingPage/Application/ApplicationLayout';

const pageConfig: ApplicationLayoutProps = {
  title: 'Advanced Product Designer',
  buttonProps: {
    label: 'Release notes',
    docId: 'apdapprninnsbruck',
  },
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
          url: '/cloud/apd/innsbruck/create/topics/c_intro.html',
        },
        {
          label: 'Request to enable APD',
          url: '',
        },
        {
          label: 'Select a workset',
          url: '',
        },
        {
          label: 'Add Guidewire markers',
          url: '',
        },
        {
          label: 'Glossary',
          url: '',
        },
      ],
    },
    {
      cardTitle: 'Build insurance products',
      items: [
        {
          label: 'Conceptualize products',
          url: '',
        },
        {
          label: 'Localize products',
          url: '',
        },
        {
          label: 'Create multi-line products',
          url: '',
        },
        {
          label: 'Visualize products',
          url: '',
        },
        {
          label: 'Finalize products',
          url: '',
        },
      ],
    },
    {
      cardTitle: 'Additional references',
      items: [
        {
          label: 'Vary insurance products over time',
          url: '',
        },
        {
          label: 'Create customer segments',
          url: '',
        },
        {
          label: 'Frequently asked questions',
          url: '',
        },
        {
          label: 'Adoption guide',
          url: '',
        },
      ],
    },
  ],
};

export default function CreateHome() {
  return <ApplicationLayout {...pageConfig} />;
}
