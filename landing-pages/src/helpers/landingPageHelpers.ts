import { LandingPageItemData } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';

type ArrangedItem = LandingPageItemData & { description?: React.ReactNode };

export function arrangeItems(
  items: LandingPageItemProps[] | undefined,
  data: LandingPageItemData[] | undefined,
  passDescriptions: boolean = false
): ArrangedItem[] {
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
      const resultingItem = passDescriptions
        ? { ...matchingOutputItem, description: inputItem.description }
        : matchingOutputItem;

      landingPageItems.push(resultingItem);
    }
  });

  return landingPageItems;
}
