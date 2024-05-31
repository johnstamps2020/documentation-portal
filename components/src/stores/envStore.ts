import { create } from 'zustand';
import { EnvName } from '../types/env';

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
