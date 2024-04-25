import { DeltaDocData, useDeltaDocData } from 'hooks/useDeltaDocData';
import React, { createContext, useContext, useState } from 'react';
import { Error as DocPortalEntityError } from 'hooks/useEntitiesData';
import {
  DeltaDocInputType,
  DeltaLevenshteinReturnType,
} from '@doctools/server';
import usePagination from '../../hooks/usePagination';
interface DeltaDocInterface {
  releaseA: DeltaDocInputType['releaseA'];
  releaseB: DeltaDocInputType['releaseB'];
  url: DeltaDocInputType['url'];
  version: DeltaDocInputType['version'];
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
  resultsPerPage: number;
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>;
  paginationData: {
    next: () => void;
    prev: () => void;
    jump: (page: number) => void;
    currentData: () => DeltaLevenshteinReturnType[];
    currentPage: number;
    maxPage: number;
  };
  page: number;
  changePage: (page: number) => void;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);
export const resultsPerPageValue = 9;

export function DeltaDocProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<DeltaDocInputType>({
    releaseA: '',
    releaseB: '',
    url: '',
    version: false,
  });

  const [resultsPerPage, setResultsPerPage] = useState(resultsPerPageValue);
  const [rootUrls, setRootUrls] = useState({ leftUrl: '', rightUrl: '' });
  const { releaseA, releaseB, url, version } = formState;
  const { deltaDocData, isError, isLoading } = useDeltaDocData({
    releaseA,
    releaseB,
    url,
    version,
  });
  const [page, setPage] = useState(1);
  const paginationData = usePagination({
    data:
      deltaDocData?.results.sort((a, b) => {
        const mainATitle =
          a.docATitle !== 'N/A - file does not exist'
            ? a.docATitle
            : a.docBTitle;
        const mainBTitle =
          b.docATitle !== 'N/A - file does not exist'
            ? b.docATitle
            : b.docBTitle;

        return mainATitle.localeCompare(mainBTitle);
      }) || [],
    itemsPerPage: resultsPerPage,
  });
  function changePage(page: number) {
    setPage(page);
    paginationData.jump(page);
  }

  const value: DeltaDocInterface = {
    releaseA: formState.releaseA,
    releaseB: formState.releaseB,
    url: formState.url,
    version: formState.version,
    setFormState,
    setRootUrls,
    rootUrls,
    deltaDocData,
    isError,
    isLoading,
    resultsPerPage,
    setResultsPerPage,
    paginationData,
    page,
    changePage,
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
