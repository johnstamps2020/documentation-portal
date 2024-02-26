import { DeltaLevenshteinReturnType } from '@doctools/server';
import React, { createContext, useContext, useState } from 'react';

interface DeltaDocInterface {
  releaseA: string;
  setReleaseA: React.Dispatch<React.SetStateAction<string>>;
  releaseB: string;
  setReleaseB: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  results: DeltaLevenshteinReturnType[] | undefined;
  setResults: React.Dispatch<
    React.SetStateAction<DeltaLevenshteinReturnType[] | undefined>
  >;
  unchangedFiles: number | undefined;
  setUnchangedFiles: React.Dispatch<React.SetStateAction<number | undefined>>;
  totalFilesScanned: number | undefined;
  setTotalFilesScanned: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  docBaseFileChanges: string | undefined;
  setDocBaseFileChanges: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  docBaseFilePercentageChanges: string | undefined;
  setDocBaseFilePercentageChanges: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  releaseALength: number | undefined;
  setReleaseALength: React.Dispatch<React.SetStateAction<number | undefined>>;
  releaseBLength: number | undefined;
  setReleaseBLength: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);

export function DeltaDocProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [releaseA, setReleaseA] = useState('');
  const [releaseB, setReleaseB] = useState('');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<DeltaDocInterface['results']>([]);
  const [unchangedFiles, setUnchangedFiles] =
    useState<DeltaDocInterface['unchangedFiles']>();
  const [totalFilesScanned, setTotalFilesScanned] =
    useState<DeltaDocInterface['totalFilesScanned']>();
  const [docBaseFileChanges, setDocBaseFileChanges] =
    useState<DeltaDocInterface['docBaseFileChanges']>();
  const [docBaseFilePercentageChanges, setDocBaseFilePercentageChanges] =
    useState<DeltaDocInterface['docBaseFilePercentageChanges']>();
  const [releaseALength, setReleaseALength] =
    useState<DeltaDocInterface['releaseALength']>();
  const [releaseBLength, setReleaseBLength] =
    useState<DeltaDocInterface['releaseBLength']>();

  const value: DeltaDocInterface = {
    releaseA,
    setReleaseA,
    releaseB,
    setReleaseB,
    url,
    setUrl,
    results,
    setResults,
    unchangedFiles,
    setUnchangedFiles,
    totalFilesScanned,
    setTotalFilesScanned,
    docBaseFileChanges,
    setDocBaseFileChanges,
    docBaseFilePercentageChanges,
    setDocBaseFilePercentageChanges,
    releaseALength,
    setReleaseALength,
    releaseBLength,
    setReleaseBLength,
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
