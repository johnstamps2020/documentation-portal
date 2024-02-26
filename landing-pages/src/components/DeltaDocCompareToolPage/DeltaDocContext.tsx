import { DeltaDocData, useDeltaDocData } from 'hooks/useDeltaDocData';
import React, { createContext, useContext, useState } from 'react';
import { Error as DocPortalEntityError } from 'hooks/useEntitiesData';

interface DeltaDocInterface {
  releaseA: string;
  setReleaseA: React.Dispatch<React.SetStateAction<string>>;
  releaseB: string;
  setReleaseB: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  deltaDocData: DeltaDocData | undefined;
  isError: DocPortalEntityError | undefined;
  isLoading: boolean;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);

export function DeltaDocProvider({ children }: { children: React.ReactNode }) {
  const [releaseA, setReleaseA] = useState('');
  const [releaseB, setReleaseB] = useState('');
  const [url, setUrl] = useState('');
  const { deltaDocData, isError, isLoading } = useDeltaDocData({
    releaseA,
    releaseB,
    url,
  });

  const value: DeltaDocInterface = {
    releaseA,
    setReleaseA,
    releaseB,
    setReleaseB,
    url,
    setUrl,
    deltaDocData,
    isError,
    isLoading,
  };

  return (
    <DeltaDocContext.Provider value={value}>
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
