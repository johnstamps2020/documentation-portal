import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { PageError } from './usePageData';
import {
  PageItemsRequestBody,
  PageItemsResponse,
} from 'server/dist/types/config';
import useSWR from 'swr';
import { Doc } from 'server/dist/model/entity/Doc';
import { Page } from 'server/dist/model/entity/Page';
import { ExternalLink } from 'server/dist/model/entity/ExternalLink';

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
    const matchingPageItem = pageItems.find(
      (pageItem) => pageItem.docId === doc.id
    );

    if (matchingPageItem) {
      result.push({
        ...doc,
        label: matchingPageItem.label || doc.title,
        videoIcon: matchingPageItem.videoIcon,
      });
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
  const { data, error, isLoading } = useSWR<LandingPageItemData[], PageError>(
    items,
    landingPageItemGetter,
    {
      revalidateOnFocus: false,
    }
  );

  const landingPageItems: LandingPageItemData[] = [];

  if (data) {
    items.forEach((inputItem) => {
      const matchingOutputItem = data?.find((outputItem) => {
        return (
          (outputItem.label &&
            inputItem.label &&
            outputItem.label === inputItem.label) ||
          (outputItem.title && outputItem.title === inputItem.label)
        );
      });

      if (
        matchingOutputItem &&
        !landingPageItems.includes(matchingOutputItem)
      ) {
        landingPageItems.push(matchingOutputItem);
      }
    });
  }

  return {
    landingPageItems:
      landingPageItems.length > 0 ? landingPageItems : undefined,
    isLoading,
    isError: error,
  };
}
