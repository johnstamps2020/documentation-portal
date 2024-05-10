import { EnvInfo, EnvName } from '@doctools/server';
import useSWRImmutable from 'swr/immutable';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EnvState {
  envName: EnvName | undefined;
  initializeEnv: () => void;
}

const getter = (url: string) => fetch(url).then((r) => r.json());

function useEnvInfo() {
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

export const useEnvStore = create<EnvState>()(
  persist(
    (set) => ({
      envName: undefined,
      initializeEnv: () => {
        const { envInfo, isError, isLoading } = useEnvInfo();
        if (isError || isLoading || !envInfo?.name) {
          return;
        }
        set({ envName: envInfo?.name });
      },
    }),
    { name: 'ai-consent-decision' }
  )
);
