import ApplicationNarrowTwoColumnLayout, {
  ApplicationNarrowTwoColumnLayoutProps,
} from './ApplicationNarrowTwoColumnLayout';

export type ApplicationFeatureSectionProps =
  ApplicationNarrowTwoColumnLayoutProps;

export default function ApplicationFeatureSection(
  props: ApplicationFeatureSectionProps
) {
  return <ApplicationNarrowTwoColumnLayout {...props} />;
}
