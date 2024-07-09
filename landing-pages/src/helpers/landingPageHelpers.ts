import { PageItemsResponse } from '@doctools/server';
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
  allAvailableItems: PageItemsResponse,
  itemToMatch: LandingPageItemProps
): LandingPageItemData | undefined {
  if (itemToMatch.docId) {
    return allAvailableItems.docs.find((doc) => doc.id === itemToMatch.docId);
  }

  if (itemToMatch.pagePath) {
    return allAvailableItems.pages.find(
      (page) => page.path === itemToMatch.pagePath
    );
  }

  if (itemToMatch.url) {
    return allAvailableItems.externalLinks.find(
      (link) => link.url === itemToMatch.url
    );
  }
  return undefined;
}
