// TODO: Temporarily duplicates some hooks from server until we get build process sorted out for core.
import {
  Product,
  Release,
  PlatformProductVersion,
  Version,
} from '../model/entity';
import { ServerSearchError } from '../types/serverSearch';
import useSWR from 'swr';

const getter = (url: string) => fetch(url).then((r) => r.json());

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

export function useProductsInProdNoRevalidation() {
  const { data, error, isLoading } = useSWR<Product[], ServerSearchError>(
    '/safeConfig/entity/Product/many/relations?isInProduction=true',
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

export function useVersionsInProdNoRevalidation() {
  const { data, error, isLoading } = useSWR<Version[], ServerSearchError>(
    '/safeConfig/entity/Version/many/relations?isInProduction=true',
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

// currently unused
export function usePPVsInProdNoRevalidation() {
  const { data, error, isLoading } = useSWR<
    PlatformProductVersion[],
    ServerSearchError
  >(
    '/safeConfig/entity/PlatformProductVersion/many/relations?isInProduction=true',
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    ppvs: data,
    isLoading,
    isError: error,
  };
}
