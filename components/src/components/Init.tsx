import { useEnvStore } from '../stores/envStore';
import { EnvName } from '../types';

function getEnvNameFromHostname(): EnvName {
  const { hostname } = window.location;

  if (hostname.includes('.staging.')) {
    return 'staging';
  }

  if (hostname.includes('.dev.')) {
    return 'dev';
  }

  if (hostname === 'localhost') {
    return 'dev';
  }

  return 'omega2-andromeda';
}

export function Init() {
  const envName = getEnvNameFromHostname();
  const initializeEnv = useEnvStore((state) => state.initializeEnv);

  initializeEnv(envName);

  return null;
}
