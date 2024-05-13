import { useEnvInfo } from '../hooks/useEnvInfo';
import { useEnvStore } from '../stores/envStore';

export function Init() {
  const { envInfo, isError, isLoading } = useEnvInfo();
  const initializeEnv = useEnvStore((state) => state.initializeEnv);

  if (isError) {
    console.error('Cannot get environment!', isError);
  }
  if (!isError && !isLoading && envInfo?.name) {
    initializeEnv(envInfo.name);
  }

  return null;
}
