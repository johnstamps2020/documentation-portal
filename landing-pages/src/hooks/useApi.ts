import {
  EnvInfo,
  ExternalLink,
  Language,
  Page,
  Platform,
  Product,
  Release,
  Resource,
  SearchData,
  ServerSearchError,
  Source,
  Subject,
  UserInfo,
  Version,
} from '@doctools/server';
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

export function useExternalLinks() {
  const { data, error, isLoading } = useSWR<ExternalLink[], ServerSearchError>(
    '/safeConfig/entity/ExternalLink/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    externalLinks: data,
    isLoading,
    isError: error,
  };
}

export function useSources() {
  const { data, error, isLoading } = useSWR<Source[], ServerSearchError>(
    '/safeConfig/entity/Source/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    sources: data,
    isLoading,
    isError: error,
  };
}

export function useResources() {
  const { data, error, isLoading } = useSWR<Resource[], ServerSearchError>(
    '/safeConfig/entity/Resource/all/relations',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    resources: data,
    isLoading,
    isError: error,
  };
}

export function useReleases() {
  const { data, error, isLoading } = useSWR<Release[], ServerSearchError>(
    '/safeConfig/entity/Release/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    releases: data,
    isLoading,
    isError: error,
  };
}

export function useSubjects() {
  const { data, error, isLoading } = useSWR<Subject[], ServerSearchError>(
    '/safeConfig/entity/Subject/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    subjects: data,
    isLoading,
    isError: error,
  };
}

export function useLanguages() {
  const { data, error, isLoading } = useSWR<Language[], ServerSearchError>(
    '/safeConfig/entity/Language/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    languages: data,
    isLoading,
    isError: error,
  };
}

export function usePlatforms() {
  const { data, error, isLoading } = useSWR<Platform[], ServerSearchError>(
    '/safeConfig/entity/Platform/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    platforms: data,
    isLoading,
    isError: error,
  };
}

export function useProducts() {
  const { data, error, isLoading } = useSWR<Product[], ServerSearchError>(
    '/safeConfig/entity/Product/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    products: data,
    isLoading,
    isError: error,
  };
}

export function useVersions() {
  const { data, error, isLoading } = useSWR<Version[], ServerSearchError>(
    '/safeConfig/entity/Version/all',
    getter,
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  return {
    versions: data,
    isLoading,
    isError: error,
  };
}
