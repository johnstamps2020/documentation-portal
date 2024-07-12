import { UserInfo } from '@doctools/components';
import {
  Doc,
  ExternalLink,
  Language,
  Page,
  PageItemsRequestBody,
  PageItemsResponse,
  Platform,
  Product,
  Release,
  Resource,
  SearchData,
  ServerSearchError,
  Source,
  Subject,
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
  const requestBody: PageItemsRequestBody = {
    docIds: [],
    pagePaths: pages.map((page) => page.path),
    externalLinkUrls: [],
  };
  const response = await fetch('/safeConfig/pageItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (response.ok) {
    const pageItems: PageItemsResponse = await response.json();
    const { pages } = pageItems;
    return pages.map((page) => ({ path: page.path, title: page.title }));
  }

  return [];
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
  const encodedSearchParams = new URLSearchParams(searchParams.toString());
  encodedSearchParams.set('q', encodeURI(searchParams.get('q') || ''));
  const { data, error, isLoading } = useSWR<SearchData, ServerSearchError>(
    `/search?${encodedSearchParams.toString()}&getData=true`,
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
  const { data, error, isLoading } = useSWRImmutable<TranslatedPage[]>(
    items,
    translatedPagesGetter,
    {}
  );

  return {
    pages: data,
    isLoading,
    isError: error,
  };
}

export function useDocsNoRevalidation() {
  const { data, error, isLoading } = useSWR<Doc[], ServerSearchError>(
    '/safeConfig/entity/Doc/all/relations',
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    docs: data,
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

export function useReleasesNoRevalidation() {
  const { data, error, isLoading } = useSWR<Release[], ServerSearchError>(
    '/safeConfig/entity/Release/all',
    getter,
    {
      revalidateOnFocus: false,
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

export function useSubjectsNoRevalidation() {
  const { data, error, isLoading } = useSWR<Subject[], ServerSearchError>(
    '/safeConfig/entity/Subject/all',
    getter,
    {
      revalidateOnFocus: false,
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

export function useLanguagesNoRevalidation() {
  const { data, error, isLoading } = useSWR<Language[], ServerSearchError>(
    '/safeConfig/entity/Language/all',
    getter,
    {
      revalidateOnFocus: false,
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

export function usePlatformsNoRevalidation() {
  const { data, error, isLoading } = useSWR<Platform[], ServerSearchError>(
    '/safeConfig/entity/Platform/all',
    getter,
    {
      revalidateOnFocus: false,
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

export function useProductsNoRevalidation() {
  const { data, error, isLoading } = useSWR<Product[], ServerSearchError>(
    '/safeConfig/entity/Product/all',
    getter,
    {
      revalidateOnFocus: false,
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
export function useVersionsNoRevalidation() {
  const { data, error, isLoading } = useSWR<Version[], ServerSearchError>(
    '/safeConfig/entity/Version/all',
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    versions: data,
    isLoading,
    isError: error,
  };
}
