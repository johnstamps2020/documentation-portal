import { useEffect } from 'react';
import { useEnvStore } from '../stores/envStore';

export function Init() {
  const initializeEnv = useEnvStore((state) => state.initializeEnv);

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
