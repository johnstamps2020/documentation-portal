import { useEffect } from 'react';
import { useEnvInfo } from '../hooks/useEnvInfo';
import { useEnvStore } from '../stores/envStore';
import {
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
  useVersionsNoRevalidation,
} from '../hooks/useEntityApi';

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
    if (isError) {
      console.error('Cannot get environment!', isError);
    }
    if (!isError && !isLoading && envInfo?.name) {
      initializeEnv(envInfo.name);

      if (productsIsError) {
        console.error('Cannot get products', productsIsError);
      }
      if (releasesIsError) {
        console.error('Cannot get releases', releasesIsError);
      }
      if (versionsIsError) {
        console.error('Cannot get versions', versionsIsError);
      }
    }
  }, [
    envInfo,
    isError,
    isLoading,
    initializeEnv,
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
    }

    if (hostname.includes('.dev.')) {
      initializeEnv('dev');
    }

    if (hostname === 'localhost') {
      setEnvNameFromServer();
    }

    initializeEnv('omega2-andromeda');
  }, []);

  return null;
}
