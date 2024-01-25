import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { PageError } from './usePageData';
import { PageItemsRequestBody, PageItemsResponse } from '@doctools/server';
import useSWR from 'swr';
import { Doc } from '@doctools/server';
import { Page } from '@doctools/server';
import { ExternalLink } from '@doctools/server';

export type LandingPageItemData = {
  label?: string;
  title?: string;
  url?: string;
  path?: string;
  videoIcon?: boolean;
  internal: boolean;
  earlyAccess: boolean;
  isInProduction: boolean;
};

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

function mapDbItemsOntoPageItems(
  pageItems: LandingPageItemProps[],
  dbResponse: PageItemsResponse
): LandingPageItemData[] {
  const result: LandingPageItemData[] = [];

  dbResponse.docs.forEach((doc: Doc) => {
    const matchingPageItems = pageItems.filter(
      (pageItem) => pageItem.docId === doc.id
    );

    if (matchingPageItems.length > 0) {
      result.push(
        ...matchingPageItems.map((pageItem) => ({
          ...doc,
          label: pageItem.label || doc.displayTitle || doc.title,
          url: pageItem.pathInDoc
            ? doc.url + '/' + pageItem.pathInDoc
            : doc.url,
          videoIcon: pageItem.videoIcon,
        }))
      );
    }
  });

  dbResponse.pages.forEach((page: Page) => {
    const matchingPageItem = pageItems.find(
      (pageItem) => pageItem.pagePath === page.path
    );

    if (matchingPageItem) {
      result.push({
        ...page,
        label: matchingPageItem.label || page.title,
        videoIcon: matchingPageItem.videoIcon,
      });
    }
  });

  dbResponse.externalLinks.forEach((externalLink: ExternalLink) => {
    const matchingPageItem = pageItems.find(
      (pageItem) => pageItem.url === externalLink.url
    );

    if (matchingPageItem) {
      result.push({
        ...externalLink,
        label: matchingPageItem.label || externalLink.label,
        videoIcon: matchingPageItem.videoIcon,
      });
    }
  });

  return result;
}

const landingPageItemGetter = async (
  items: LandingPageItemProps[]
): Promise<LandingPageItemData[]> => {
  if (items.length === 0) {
    return [];
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
      return mapDbItemsOntoPageItems(items, jsonData);
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export function useLandingPageItems(items: LandingPageItemProps[]) {
  const {
    data: landingPageItems,
    error,
    isLoading,
  } = useSWR<LandingPageItemData[], PageError>(items, landingPageItemGetter, {
    revalidateOnFocus: false,
  });

  return {
    landingPageItems,
    isLoading,
    isError: error,
  };
}
