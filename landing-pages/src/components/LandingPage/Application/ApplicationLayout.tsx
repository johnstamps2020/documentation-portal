import Stack from '@mui/material/Stack';
import { useLayoutContext } from 'LayoutContext';
import { useLandingPageItemsImmutable } from 'hooks/useLandingPageItemsImmutable';
import { useEffect } from 'react';
import { LandingPageItemsProvider } from '../LandingPageItemsContext';
import { LandingPageSelectorProps } from '../LandingPageSelector';
import { ApplicationCardProps } from './ApplicationCard';
import ApplicationCardSection from './ApplicationCardSection';
import ApplicationFeatureSection, {
  ApplicationFeatureSectionProps,
} from './ApplicationFeatureSection';
import ApplicationHero, { ApplicationHeroProps } from './ApplicationHero';
import ApplicationResources, {
  ApplicationResourcesProps,
} from './ApplicationResources';
import ApplicationTabWrapper from './ApplicationTabWrapper';
import { ApplicationTabItemProps } from './ApplicationTabs';
import ApplicationVideoSection, {
  ApplicationVideoSectionProps,
} from './ApplicationVideoSection';

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

  const itemsFromTabs = tabs?.map((tab) => tab.items).flat() || [];
  const itemsFromCards = cards?.map((card) => card.items).flat() || [];
  const itemsFromResources = resources?.items || [];
  const itemsFromSelector = selector?.items || [];
  const allItems = [
    ...itemsFromTabs,
    ...itemsFromCards,
    ...itemsFromResources,
    ...itemsFromSelector,
    buttonProps,
  ];
  const { landingPageItems } = useLandingPageItemsImmutable(allItems);

  useEffect(() => {
    if (selector) {
      setSelector(selector);
    }

    return () => {
      setSelector(undefined);
    };
  }, [selector, setSelector]);

  return (
    <LandingPageItemsProvider allAvailableItems={landingPageItems}>
      <Stack>
        <ApplicationHero
          buttonProps={buttonProps}
          title={title}
          heroDescription={heroDescription}
        />
        {introFeatureSectionProps && (
          <ApplicationFeatureSection {...introFeatureSectionProps} />
        )}
        {videoSectionProps && (
          <ApplicationVideoSection {...videoSectionProps} />
        )}
        {tabs && <ApplicationTabWrapper tabs={tabs} />}
        {cards && <ApplicationCardSection items={cards} />}
        {featureSections &&
          featureSections.map((featureSection, idx) => (
            <ApplicationFeatureSection key={idx} {...featureSection} />
          ))}
        {resources && <ApplicationResources {...resources} />}
      </Stack>
    </LandingPageItemsProvider>
  );
}
