// TODO: Temporarily duplicates some hooks from server until we get build process sorted out for core.
import {
  Product,
  Release,
  PlatformProductVersion,
  Version,
} from '../model/entity';
import { ServerSearchError } from '../types/serverSearch';
import useSWR from 'swr';

const EXCLUDED_PRODUCTS = [
  'Community Case Templates',
  'Configuration Manager',
  'DevConnect',
  'EasyGuide',
  'LRS',
  'Glossary',
  'Guidewire Cloud Standards',
  'HazardHub Casualty',
  'InsuranceSuite Package for Australia',
  'InsuranceSuite Package for Germany',
  'InsuranceSuite Package for Japan',
  'Lines of Business',
  'London Market',
  'Portfolio Assembly',
  'Product Adoption Resources',
  'Standards-based Template Framework',
  'Underwriting Framework',
  'Underwriting Management',
  'CustomerEngage Account Management',
  'CustomerEngage Account Management for ClaimCenter',
  'CustomerEngage Quote and Buy',
  'ProducerEngage',
  'ProducerEngage for ClaimCenter',
  'ServiceRepEngage',
  'VendorEngage',
];

const getter = (url: string) => fetch(url).then((r) => r.json());

export function useProductsNoRevalidation() {
  const { data, error, isLoading } = useSWR<Product[], ServerSearchError>(
    '/safeConfig/entity/Product/all',
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  if (data) {
    const filteredData = trimList(data, EXCLUDED_PRODUCTS);
    return {
      products: filteredData,
      isLoading,
      isError: error,
    };
  }

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

  if (data) {
    const filteredData = trimList(data, EXCLUDED_PRODUCTS);
    return {
      products: filteredData,
      isLoading,
      isError: error,
    };
  }

  return {
    products: data,
    isLoading,
    isError: error,
  };
}

function trimList(
  data: Product[] | Release[] | Version[],
  excludeList: string[]
) {
  return data.filter((product) => !excludeList.includes(product.name));
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

export function useReleasesInProdNoRevalidation() {
  const { data, error, isLoading } = useSWR<Release[], ServerSearchError>(
    '/safeConfig/entity/Release/many/relations?isInProduction=true',
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
