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
};

export default function CreateHome() {
  return <ApplicationLayout {...pageConfig} />;
}
