import { DeltaDocData, useDeltaDocData } from 'hooks/useDeltaDocData';
import React, { createContext, useContext, useState } from 'react';
import { Error as DocPortalEntityError } from 'hooks/useEntitiesData';
import { DeltaDocInputType } from '@doctools/server';

interface DeltaDocInterface {
  releaseA: DeltaDocInputType['releaseA'];
  releaseB: DeltaDocInputType['releaseB'];
  url: DeltaDocInputType['url'];
  setFormState: React.Dispatch<React.SetStateAction<DeltaDocInputType>>;
  setRootUrls: React.Dispatch<
    React.SetStateAction<{
      leftUrl: string;
      rightUrl: string;
    }>
  >;
  rootUrls: {
    leftUrl: string;
    rightUrl: string;
  };
  deltaDocData: DeltaDocData | undefined;
  isError: DocPortalEntityError | undefined;
  isLoading: boolean;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);

export function DeltaDocProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<DeltaDocInputType>({
    releaseA: '',
    releaseB: '',
    url: '',
  });
  const [rootUrls, setRootUrls] = useState({ leftUrl: '', rightUrl: '' });
  const { releaseA, releaseB, url } = formState;
  const { deltaDocData, isError, isLoading } = useDeltaDocData({
    releaseA,
    releaseB,
    url,
  });

  const value: DeltaDocInterface = {
    releaseA: formState.releaseA,
    releaseB: formState.releaseB,
    url: formState.url,
    setFormState,
    setRootUrls,
    rootUrls,
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
