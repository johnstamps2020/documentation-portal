import {
  DeltaDocData,
  useBatchDeltaDocData,
  useDeltaDocData,
} from 'hooks/useDeltaDocData';
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
  setFormState: React.Dispatch<React.SetStateAction<DeltaDocInputType>>;
  setRootUrl: React.Dispatch<React.SetStateAction<string>>;
  rootUrl: string;
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
  batchComparison: boolean;
  setBatchComparison: React.Dispatch<React.SetStateAction<boolean>>;
  deltaDocBatchData:
    | (DeltaDocData & {
        url: string;
        releaseA: string;
        releaseB: string;
      })[]
    | undefined;
  isBatchError: DocPortalEntityError | undefined;
  isBatchLoading: boolean;
  setBatchFormState: React.Dispatch<React.SetStateAction<DeltaDocInputType[]>>;
  batchFormState: DeltaDocInputType[];
  batchProduct: string;
  setBatchProduct: React.Dispatch<React.SetStateAction<string>>;
  numberOfDocsInProduct: number | undefined;
  setNumberOfDocsInProduct: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);
export const resultsPerPageValue = 9;

export function DeltaDocProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<DeltaDocInputType>({
    releaseA: '',
    releaseB: '',
    url: '',
  });
  const [batchFormState, setBatchFormState] = useState<DeltaDocInputType[]>([
    {
      releaseA: '',
      releaseB: '',
      url: '',
    },
  ]);
  const [batchProduct, setBatchProduct] = useState('');
  const [numberOfDocsInProduct, setNumberOfDocsInProduct] = useState<number>();
  const [resultsPerPage, setResultsPerPage] = useState(resultsPerPageValue);
  const [rootUrl, setRootUrl] = useState('');
  const [batchComparison, setBatchComparison] = useState(false);
  const { releaseA, releaseB, url } = formState;
  const { deltaDocData, isError, isLoading } = useDeltaDocData({
    releaseA,
    releaseB,
    url,
  });

  const {
    deltaDocBatchData,
    isError: isBatchError,
    isLoading: isBatchLoading,
  } = useBatchDeltaDocData(batchFormState);

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
    setFormState,
    setRootUrl,
    rootUrl,
    deltaDocData,
    isError,
    isLoading,
    resultsPerPage,
    setResultsPerPage,
    paginationData,
    page,
    changePage,
    batchComparison,
    setBatchComparison,
    deltaDocBatchData,
    isBatchError,
    isBatchLoading,
    batchFormState,
    setBatchFormState,
    batchProduct,
    setBatchProduct,
    numberOfDocsInProduct,
    setNumberOfDocsInProduct,
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
