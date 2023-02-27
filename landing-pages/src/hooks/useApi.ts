import useSWR from 'swr';
import { LandingPageItem } from '../pages/LandingPage/LandingPage';
import { usePagePath } from './usePageData';

const getter = (url: string) => fetch(url).then((r) => r.json());

type BreadcrumbItem = {
  label: string;
  path: string;
  id: string;
};

export function useBreadcrumbs() {
  const pagePath = usePagePath();
  const { data, error, isLoading } = useSWR<BreadcrumbItem[]>(
    `/safeConfig/entity/page/breadcrumbs?path=${pagePath}`,
    getter
  );

  return {
    breadcrumbs: data,
    isLoading,
    isError: error,
  };
}
