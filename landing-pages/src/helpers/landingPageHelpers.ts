import { LandingPageItemData } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';

export function arrangeItems(
  items: LandingPageItemProps[] | undefined,
  data: LandingPageItemData[] | undefined
) {
  const landingPageItems: LandingPageItemData[] = [];

  items?.forEach((inputItem) => {
    const matchingOutputItem = data?.find((outputItem) => {
      return (
        (outputItem.label &&
          inputItem.label &&
          outputItem.label === inputItem.label) ||
        (outputItem.title && outputItem.title === inputItem.label)
      );
    });

    if (matchingOutputItem && !landingPageItems.includes(matchingOutputItem)) {
      landingPageItems.push(matchingOutputItem);
    }
  });

  return landingPageItems;
}
