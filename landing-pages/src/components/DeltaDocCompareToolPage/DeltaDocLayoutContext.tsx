import { Release, ServerSearchError } from '@doctools/server';
import { useReleases } from 'hooks/useApi';
import React, { createContext, useContext, useState } from 'react';

interface DeltaDocInterface {
  releaseA: string;
  setReleaseA: React.Dispatch<React.SetStateAction<string>>;
  releaseB: string;
  setReleaseB: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);

export function DeltaDocContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [releaseA, setReleaseA] = useState('Elysian');
  const [releaseB, setReleaseB] = useState('Flaine');
  const [url, setUrl] = useState('/cloud/cc/202210/app/app/cc/');
  const [page, setPage] = useState(1);

  return (
    <DeltaDocContext.Provider
      value={{
        releaseA,
        setReleaseA,
        releaseB,
        setReleaseB,
        page,
        setPage,
        url,
        setUrl,
      }}
    >
      {children}
    </DeltaDocContext.Provider>
  );
}
export function useDeltaDocContext() {
  const context = useContext(DeltaDocContext);

  if (!context) {
    throw new Error(
      'useDeltaDocContext must be used within a DeltaDocProvider'
    );
  }

  return context;
}
