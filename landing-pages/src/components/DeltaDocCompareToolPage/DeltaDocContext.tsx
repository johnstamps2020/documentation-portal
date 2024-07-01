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
  Doc,
} from '@doctools/server';
import usePagination from '../../hooks/usePagination';
interface DeltaDocInterface {
  firstDocId: DeltaDocInputType['firstDocId'];
  secondDocId: DeltaDocInputType['secondDocId'];
  firstDoc: Doc | undefined;
  secondDoc: Doc | undefined;
  setFirstDoc: React.Dispatch<React.SetStateAction<Doc | undefined>>;
  setSecondDoc: React.Dispatch<React.SetStateAction<Doc | undefined>>;
  releaseA: string[];
  releaseB: string[];
  setReleaseA: React.Dispatch<React.SetStateAction<string[]>>;
  setReleaseB: React.Dispatch<React.SetStateAction<string[]>>;
  setFormState: React.Dispatch<React.SetStateAction<DeltaDocInputType>>;
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
  deltaDocBatchData: (DeltaDocData & DeltaDocInputType)[] | undefined;
  isBatchError: DocPortalEntityError | undefined;
  isBatchLoading: boolean;
  setBatchFormState: React.Dispatch<React.SetStateAction<DeltaDocInputType[]>>;
  batchFormState: DeltaDocInputType[];
  batchProduct: string;
  setBatchProduct: React.Dispatch<React.SetStateAction<string>>;
}

export const DeltaDocContext = createContext<DeltaDocInterface | null>(null);
export const resultsPerPageValue = 9;

export function DeltaDocProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<DeltaDocInputType>({
    firstDocId: '',
    secondDocId: '',
  });
  const [batchFormState, setBatchFormState] = useState<DeltaDocInputType[]>([
    {
      firstDocId: '',
      secondDocId: '',
    },
  ]);
  const [firstDoc, setFirstDoc] = useState<Doc>();
  const [secondDoc, setSecondDoc] = useState<Doc>();
  const [batchProduct, setBatchProduct] = useState('');
  const [resultsPerPage, setResultsPerPage] = useState(resultsPerPageValue);
  const [batchComparison, setBatchComparison] = useState(false);
  const { deltaDocData, isError, isLoading } = useDeltaDocData(formState);
  const {
    deltaDocBatchData,
    isError: isBatchError,
    isLoading: isBatchLoading,
  } = useBatchDeltaDocData(batchFormState);
  const [releaseA, setReleaseA] = useState<string[]>([]);
  const [releaseB, setReleaseB] = useState<string[]>([]);
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
    firstDocId: formState.firstDocId,
    secondDocId: formState.secondDocId,
    setSecondDoc,
    setFirstDoc,
    firstDoc,
    secondDoc,
    releaseA,
    releaseB,
    setReleaseA,
    setReleaseB,
    setFormState,
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
