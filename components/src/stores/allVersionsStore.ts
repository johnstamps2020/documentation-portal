import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Version } from '../model/entity';

interface AllVersionsState {
  allVersions: Version[] | undefined;
  initializeAllVersions: (versions: Version[]) => void;
}

export const useAllVersionsStore = create<AllVersionsState>()(
  persist(
    (set) => ({
      allVersions: undefined,
      initializeAllVersions: (versions) => set({ allVersions: versions }),
    }),
    { name: 'all-versions', getStorage: () => sessionStorage }
  )
);
