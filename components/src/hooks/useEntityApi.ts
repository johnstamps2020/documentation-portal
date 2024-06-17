// TODO: Temporarily duplicates some hooks from server until we get build process sorted out for core.
import { Product, Release } from '../model/entity';
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
