import { LandingPageItem } from '../pages/LandingPage/LandingPage';
import { PageError } from './usePageData';
import useSWR from 'swr';

type LandingPageItemData = {
  label?: string;
  title?: string;
  url?: string;
  path?: string;
  internal: boolean;
  earlyAccess: boolean;
  isInProduction: boolean;
};

const landingPageItemGetter = async (
  item: LandingPageItem
): Promise<LandingPageItemData> => {
  let urlSuffix;
  if (item.docId) {
    urlSuffix = `Doc?id=${item.docId}`;
  } else if (item.pagePath) {
    urlSuffix = `Page?path=${item.pagePath}`;
  } else {
    urlSuffix = `ExternalLink?url=${item.url}`;
  }

  const response = await fetch(`/safeConfig/entity/${urlSuffix}`);
  const { status } = response;
  const jsonData = await response.json();
  if (!response.ok) {
    throw new PageError(status, jsonData.message);
  }
  return jsonData;
};

export function useLandingPageItemData(item: LandingPageItem) {
  const { data, error, isLoading } = useSWR<LandingPageItemData, PageError>(
    item,
    landingPageItemGetter
  );

  return {
    landingPageItemData: data,
    isLoading,
    isError: error,
  };
}
