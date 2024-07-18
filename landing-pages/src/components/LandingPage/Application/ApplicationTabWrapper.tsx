import { getListOfItemsToDisplayOnLandingPage } from 'helpers/landingPageHelpers';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import ApplicationTabs, { ApplicationTabsProps } from './ApplicationTabs';

export default function ApplicationTabWrapper(props: ApplicationTabsProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const firstTabWithItems = props.tabs.findIndex(
    (tab) =>
      getListOfItemsToDisplayOnLandingPage(tab.items, allAvailableItems)
        .length > 0
  );

  return (
    <>
      <ApplicationTabs
        {...props}
        initiallySelectedTab={firstTabWithItems !== -1 ? firstTabWithItems : 0}
      />
    </>
  );
}
