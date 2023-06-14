import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { PageError } from './usePageData';
import useSWR from 'swr';

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

const landingPageItemGetter = async (
  items: LandingPageItemProps[]
): Promise<LandingPageItemData[]> => {
  if (items.length === 0) {
    return [];
  }
  const landingPageItems: LandingPageItemData[] = [];
  try {
    for (const item of items) {
      let urlSuffix;
      if (item.docId) {
        urlSuffix = `Doc?id=${item.docId}`;
      } else if (item.pagePath) {
        urlSuffix = `Page?path=${item.pagePath}`;
      } else {
        if (item.url) {
          urlSuffix = `ExternalLink?url=${encodeURIComponent(item.url)}`;
        }
      }

      const response = await fetch(`/safeConfig/entity/${urlSuffix}`);
      if (response.ok) {
        const jsonData = await response.json();
        landingPageItems.push({
          ...jsonData,
          label: item.label || jsonData.label,
          title: item.label || jsonData.title,
          videoIcon: item.videoIcon,
        });
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    return landingPageItems;
  }
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
