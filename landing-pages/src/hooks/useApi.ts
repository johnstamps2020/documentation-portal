import useSWR from 'swr';
import { PageError, usePagePath } from './usePageData';
import { UserInfo } from 'server/dist/types/user';

const getter = (url: string) => fetch(url).then(r => r.json());

type BreadcrumbItem = {
  label: string;
  path: string;
  id: string;
};

export function useUserInfo() {
  const { data, error, isLoading } = useSWR<UserInfo, PageError>(
    '/userInformation',
    getter
  );

  return {
    userInfo: data,
    isLoading,
    isError: error,
  };
}

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
