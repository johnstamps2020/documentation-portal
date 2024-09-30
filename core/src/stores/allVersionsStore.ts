import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Version } from '../model/entity';

interface AllVersionsState {
  allVersions: Version[] | undefined;
  initializeAllVersions: (versions: Version[]) => void;
}

const sessionStorage: PersistStorage<AllVersionsState> = {
  getItem: (name) => {
    const item = window.sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    window.sessionStorage.removeItem(name);
  },
};

export const useAllVersionsStore = create<AllVersionsState>()(
  persist(
    (set) => ({
      allVersions: undefined,
      initializeAllVersions: (versions) => set({ allVersions: versions }),
    }),
    { name: 'all-versions', storage: sessionStorage }
  )
);
