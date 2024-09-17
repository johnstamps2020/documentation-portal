import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Release } from '../model/entity';

interface AllReleasesState {
  allReleases: Release[] | undefined;
  initializeAllReleases: (releases: Release[]) => void;
}

const sessionStorage: PersistStorage<AllReleasesState> = {
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

export const useAllReleasesStore = create<AllReleasesState>()(
  persist(
    (set) => ({
      allReleases: undefined,
      initializeAllReleases: (releases) => {
        set({ allReleases: releases });
      },
    }),
    { name: 'all-releases', storage: sessionStorage }
  )
);
