import { DeltaLevenshteinReturnType } from '@doctools/server';
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

export function DeltaDocContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [releaseA, setReleaseA] = useState('');
  const [releaseB, setReleaseB] = useState('');
  const [url, setUrl] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<DeltaLevenshteinReturnType[]>();
  const [unchangedFiles, setUnchangedFiles] = useState<number>();
  const [totalFilesScanned, setTotalFilesScanned] = useState<number>();
  const [docBaseFileChanges, setDocBaseFileChanges] = useState<string>();
  const [docBaseFilePercentageChanges, setDocBaseFilePercentageChanges] =
    useState<string>();
  const [releaseALength, setReleaseALength] = useState<number>();
  const [releaseBLength, setReleaseBLength] = useState<number>();

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
