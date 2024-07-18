import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Release } from '../model/entity';

interface AllReleasesState {
  allReleases: Release[] | undefined;
  initializeAllReleases: (releases: Release[]) => void;
}

export const useAllReleasesStore = create<AllReleasesState>()(
  persist(
    (set) => ({
      allReleases: undefined,
      initializeAllReleases: (releases) => {
        set({ allReleases: releases });
      },
    }),
    { name: 'all-releases' }
  )
);
