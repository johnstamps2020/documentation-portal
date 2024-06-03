import {
  EnvInfo,
  Page,
  SearchData,
  ServerSearchError,
  UserInfo,
} from '@doctools/components';
import { useParams, useSearchParams } from 'react-router-dom';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { TranslatedPage } from '../components/Layout/Header/TranslatedPages';
import { PageError } from './usePageData';

const getter = (url: string) => fetch(url).then((r) => r.json());

const translatedPagesGetter = async (
  pages: TranslatedPage[]
): Promise<TranslatedPage[]> => {
  const availablePages: TranslatedPage[] = [];
  for (const page of pages) {
    const response = await fetch(`/safeConfig/entity/Page?path=${page.path}`);
    if (response.ok) {
      availablePages.push(page);
    }
  }
  return availablePages;
};

type BreadcrumbItem = {
  label: string;
  path: string;
  id: string;
};

export function useUserInfo() {
  const { data, error, isLoading } = useSWR<UserInfo, PageError>(
    '/userInformation',
    getter,
    { revalidateOnFocus: false }
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
    getter,
    { revalidateOnFocus: false }
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
    getter,
    { revalidateOnFocus: false }
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

export function useTranslatedPages(items: TranslatedPage[]) {
  const { data, error, isLoading } = useSWR<TranslatedPage[]>(
    items,
    translatedPagesGetter,
    { revalidateOnFocus: false }
  );

  return {
    pages: data,
    isLoading,
    isError: error,
  };
}
