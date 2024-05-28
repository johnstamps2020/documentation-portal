import useSWRImmutable from 'swr/immutable';
import { EnvInfo } from '../types/env';

const getter = (url: string) => fetch(url).then((r) => r.json());

export function useEnvInfo() {
  const { data, error, isLoading } = useSWRImmutable<EnvInfo, string>(
    '/envInformation',
    getter
  );

  return {
    envInfo: data,
    isLoading,
    isError: error,
  };
}
