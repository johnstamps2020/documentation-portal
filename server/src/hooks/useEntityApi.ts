// TODO: Move to doctools/components/hooks

import {
  ExternalLink,
  Language,
  Platform,
  Product,
  Release,
  Resource,
  Source,
  Subject,
  Version,
} from '../model/entity';
import { ServerSearchError } from '../types/serverSearch';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const getter = (url: string) => fetch(url).then((r) => r.json());

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
