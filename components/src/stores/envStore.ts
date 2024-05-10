import { EnvName } from '@doctools/server';
import { create } from 'zustand';

interface EnvState {
  envName: EnvName | undefined;
  initializeEnv: (value: EnvName) => void;
}

export const useEnvStore = create<EnvState>()((set) => ({
  envName: undefined,
  initializeEnv: (value) => {
    set({ envName: value });
  },
}));
