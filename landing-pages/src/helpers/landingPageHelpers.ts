import { LandingPageItemData } from 'hooks/hookTypes';
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

export function capitalizeFirstLetter(text: string) {
  return text.replace(/^(.)/, function (string) {
    return string.toUpperCase();
  });
}

export function findMatchingPageItemData(
  allAvailableItems: LandingPageItemData[],
  itemToMatch: LandingPageItemProps
): LandingPageItemData | undefined {
  return allAvailableItems.find((item) => {
    if (itemToMatch.docId && itemToMatch.docId === item.id) {
      return true;
    }

    if (itemToMatch.pagePath && itemToMatch.pagePath === item.path) {
      return true;
    }

    if (itemToMatch.url && itemToMatch.url === item.path) {
      return true;
    }

    return false;
  });
}
