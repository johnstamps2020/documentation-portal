import { LandingPageItemProps } from '../pages/LandingPage/LandingPage';
import { PageError } from './usePageData';
import useSWR from 'swr';

export type LandingPageItemData = {
  label?: string;
  title?: string;
  url?: string;
  path?: string;
  internal: boolean;
  earlyAccess: boolean;
  isInProduction: boolean;
};

const landingPageItemGetter = async (
  items: LandingPageItemProps[]
): Promise<LandingPageItemData[]> => {
  let urlSuffix;
  const landingPageItems = [];
  for (const item of items) {
    if (item.docId) {
      urlSuffix = `Doc?id=${item.docId}`;
    } else if (item.pagePath) {
      urlSuffix = `Page?path=${item.pagePath}`;
    } else {
      urlSuffix = `ExternalLink?url=${item.url}`;
    }

    const response = await fetch(`/safeConfig/entity/${urlSuffix}`);
    if (response.ok) {
      const jsonData = await response.json();
      landingPageItems.push({
        ...jsonData,
        label: item.label || jsonData.label,
        title: item.label || jsonData.title,
      });
    }
  }
  if (landingPageItems.length === 0) {
    throw new Error('No items found.');
  }
  return landingPageItems;
};

export function useLandingPageItems(items: LandingPageItemProps[]) {
  const { data, error, isLoading } = useSWR<LandingPageItemData[], PageError>(
    items,
    landingPageItemGetter
  );

  return {
    landingPageItems: data,
    isLoading,
    isError: error,
  };
}
