import Stack from '@mui/material/Stack';
import { ApplicationCardProps } from './ApplicationCard';
import ApplicationCardSection from './ApplicationCardSection';
import ApplicationFeatureSection, {
  ApplicationFeatureSectionProps,
} from './ApplicationFeatureSection';
import ApplicationHero, { ApplicationHeroProps } from './ApplicationHero';
import ApplicationResources, {
  ApplicationResourcesProps,
} from './ApplicationResources';
import ApplicationTabs, { ApplicationTabItemProps } from './ApplicationTabs';
import ApplicationVideoSection, {
  ApplicationVideoSectionProps,
} from './ApplicationVideoSection';

export type ApplicationLayoutProps = ApplicationHeroProps & {
  tabs?: ApplicationTabItemProps[];
  videoSectionProps?: ApplicationVideoSectionProps;
  cards?: ApplicationCardProps[];
  featureSections?: ApplicationFeatureSectionProps[];
  resources?: ApplicationResourcesProps;
};

export default function ApplicationLayout({
  tabs,
  cards,
  buttonProps,
  heroDescription,
  title,
  videoSectionProps,
  featureSections,
  resources,
}: ApplicationLayoutProps) {
  return (
    <Stack gap="35px">
      <ApplicationHero
        buttonProps={buttonProps}
        title={title}
        heroDescription={heroDescription}
      />
      {videoSectionProps && <ApplicationVideoSection {...videoSectionProps} />}
      {tabs && <ApplicationTabs tabs={tabs} />}
      {cards && <ApplicationCardSection items={cards} />}
      {featureSections &&
        featureSections.map((featureSection, idx) => (
          <ApplicationFeatureSection key={idx} {...featureSection} />
        ))}
      {resources && <ApplicationResources {...resources} />}
    </Stack>
  );
}
