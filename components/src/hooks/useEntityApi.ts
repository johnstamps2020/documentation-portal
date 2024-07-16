// TODO: Temporarily duplicates some hooks from server until we get build process sorted out for core.
import { useEffect } from 'react';
import { Product, Release, Version } from '../model/entity';
import { ServerSearchError } from '../types/serverSearch';
import { useAllProductsStore } from '../stores/allProductsStore';
import { useAllReleasesStore } from '../stores/allReleasesStore';
import { useAllVersionsStore } from '../stores/allVersionsStore';
import { useEnvStore } from '../stores/envStore';
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

//const getter = (url: string) => fetch(url).then((r) => r.json());

const getter = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) {
      throw new Error('Network response was not ok');
    }
    return r.json();
  });

export function useProductsNoRevalidation() {
  const { envName } = useEnvStore();
  const { allProducts, initializeAllProducts } = useAllProductsStore();
  const productApiUrl =
    envName === 'omega2-andromeda'
      ? '/safeConfig/entity/Product/many/relations?isInProduction=true'
      : '/safeConfig/entity/Product/all';
  const { data, error, isLoading } = useSWR<Product[], ServerSearchError>(
    allProducts === undefined ? productApiUrl : null,
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const filteredData = trimList(data, EXCLUDED_PRODUCTS);
      initializeAllProducts(filteredData);
    }
  }, [data, initializeAllProducts]);

  return {
    products: allProducts || data,
    isLoading: !allProducts && isLoading,
    isError: !allProducts && error,
  };
}

function trimList(
  data: Product[] | Release[] | Version[],
  excludeList: string[]
) {
  return data.filter((element) => !excludeList.includes(element.name));
}

export function useReleasesNoRevalidation() {
  const { envName } = useEnvStore();
  const { allReleases, initializeAllReleases } = useAllReleasesStore();
  const releaseApiUrl =
    envName === 'omega2-andromeda'
      ? '/safeConfig/entity/Release/many/relations?isInProduction=true'
      : '/safeConfig/entity/Release/all';

  const { data, error, isLoading } = useSWR<Release[], ServerSearchError>(
    allReleases === undefined ? releaseApiUrl : null,
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      initializeAllReleases(data);
    }
  }, [data, initializeAllReleases]);

  return {
    releases: allReleases || data,
    isLoading: !allReleases && isLoading,
    isError: !allReleases && error,
  };
}

export function useVersionsNoRevalidation() {
  const { envName } = useEnvStore();
  const { allVersions, initializeAllVersions } = useAllVersionsStore();
  const versionApiUrl =
    envName === 'omega2-andromeda'
      ? '/safeConfig/entity/Version/many/relations?isInProduction=true'
      : '/safeConfig/entity/Version/all';

  const { data, error, isLoading } = useSWR<Version[], ServerSearchError>(
    allVersions === undefined ? versionApiUrl : null,
    getter,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      initializeAllVersions(data);
    }
  }, [data, initializeAllVersions]);

  return {
    versions: allVersions || data,
    isLoading: !allVersions && isLoading,
    isError: !allVersions && error,
  };
}
