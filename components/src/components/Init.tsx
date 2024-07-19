import { useEffect } from 'react';
import {
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
  useVersionsNoRevalidation,
} from '../hooks/useEntityApi';
import { useEnvStore } from '../stores/envStore';

export function Init() {
  const initializeEnv = useEnvStore((state) => state.initializeEnv);

  const {
    products,
    isError: productsIsError,
    isLoading: productsIsLoading,
  } = useProductsNoRevalidation();

  const {
    releases,
    isError: releasesIsError,
    isLoading: releasesIsLoading,
  } = useReleasesNoRevalidation();

  const {
    versions,
    isError: versionsIsError,
    isLoading: versionsIsLoading,
  } = useVersionsNoRevalidation();

  useEffect(() => {
    if (productsIsError) {
      console.error('Cannot get products', productsIsError);
    }
    if (releasesIsError) {
      console.error('Cannot get releases', releasesIsError);
    }
    if (versionsIsError) {
      console.error('Cannot get versions', versionsIsError);
    }
  }, [
    products,
    productsIsError,
    productsIsLoading,
    releases,
    releasesIsError,
    releasesIsLoading,
    versions,
    versionsIsError,
    versionsIsLoading,
  ]);

  useEffect(() => {
    async function setEnvNameFromServer() {
      const response = await fetch('/envInformation');
      if (response.ok) {
        const envInfo = await response.json();
        const envNameFromServer = envInfo.name;
        if (envNameFromServer) {
          initializeEnv(envNameFromServer);
        }
      }
    }

    const { hostname } = window.location;

    if (hostname.includes('.staging.')) {
      initializeEnv('staging');
    } else if (hostname.includes('.dev.')) {
      initializeEnv('dev');
    } else if (hostname === 'localhost') {
      setEnvNameFromServer();
    } else {
      initializeEnv('omega2-andromeda');
    }
  }, []);

  return null;
}
