import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PageError } from './usePageData';
import { UserInfo } from 'server/dist/types/user';
import { EnvInfo } from 'server/dist/types/env';
import { useParams, useSearchParams } from 'react-router-dom';
import { SearchData, ServerSearchError } from 'server/dist/types/serverSearch';
import { Page } from 'server/dist/model/entity/Page';

const getter = (url: string) => fetch(url).then((r) => r.json());

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

export function useEnvInfo() {
  const { data, error, isLoading } = useSWRImmutable<EnvInfo, PageError>(
    '/envInformation',
    getter
  );

  return {
    envInfo: data,
    isLoading,
    isError: error,
  };
}

export function useBreadcrumbs() {
  const reactRouterParams = useParams();
  const pagePath = reactRouterParams['*'];
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

export function useSearchData() {
  const [searchParams] = useSearchParams();
  const { data, error, isLoading } = useSWR<SearchData, ServerSearchError>(
    `/search?${searchParams.toString()}&getData=true`,
    getter
  );

  return {
    searchData: data,
    isLoading,
    isError: error,
  };
}

export function usePages() {
  const { data, error, isLoading } = useSWR<Page[], ServerSearchError>(
    '/safeConfig/entity/Page/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    pages: data,
    isLoading,
    isError: error,
  };
}
