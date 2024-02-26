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
import { LandingPageSelectorProps } from '../LandingPageSelector';
import { useEffect } from 'react';
import { useLayoutContext } from 'LayoutContext';

export type ApplicationLayoutProps = ApplicationHeroProps & {
  tabs?: ApplicationTabItemProps[];
  introFeatureSectionProps?: ApplicationFeatureSectionProps;
  videoSectionProps?: ApplicationVideoSectionProps;
  cards?: ApplicationCardProps[];
  featureSections?: ApplicationFeatureSectionProps[];
  resources?: ApplicationResourcesProps;
  selector?: LandingPageSelectorProps;
};

export default function ApplicationLayout({
  tabs,
  cards,
  buttonProps,
  heroDescription,
  title,
  introFeatureSectionProps,
  videoSectionProps,
  featureSections,
  resources,
  selector,
}: ApplicationLayoutProps) {
  const { setSelector } = useLayoutContext();

  useEffect(() => {
    if (selector) {
      setSelector(selector);
    }

    return () => {
      setSelector(undefined);
    };
  }, [selector, setSelector]);

  return (
    <Stack>
      <ApplicationHero
        buttonProps={buttonProps}
        title={title}
        heroDescription={heroDescription}
      />
      {introFeatureSectionProps && (
        <ApplicationFeatureSection {...introFeatureSectionProps} />
      )}

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
