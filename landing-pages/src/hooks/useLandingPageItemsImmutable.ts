import {
  PageItemsRequestBody,
  PageItemsResponse
} from '@doctools/server';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import useSWRImmutable from 'swr/immutable';
import { PageError } from './usePageData';

function getPropValuesByKey(
  items: LandingPageItemProps[],
  key: 'docId' | 'pagePath' | 'url'
): string[] {
  const values: string[] = [];
  for (const item of items) {
    const matchingItem = item[key];
    if (matchingItem) {
      values.push(matchingItem);
    }
  }

  return values;
}

const landingPageItemGetter = async (
  items: LandingPageItemProps[]
): Promise<PageItemsResponse | undefined> => {
  if (items.length === 0) {
    return undefined;
  }
  try {
    const requestBody: PageItemsRequestBody = {
      docIds: getPropValuesByKey(items, 'docId'),
      pagePaths: getPropValuesByKey(items, 'pagePath'),
      externalLinkUrls: getPropValuesByKey(items, 'url'),
    };

    const response = await fetch('/safeConfig/pageItems', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const jsonData: PageItemsResponse = await response.json();
      return jsonData;
    }
    return undefined;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export function useLandingPageItemsImmutable(items: LandingPageItemProps[]) {
  const {
    data: landingPageItems,
    error,
    isLoading,
  } = useSWRImmutable<PageItemsResponse | undefined, PageError>(
    items,
    landingPageItemGetter,
    {}
  );

  return {
    landingPageItems,
    isLoading,
    isError: error,
  };
}
