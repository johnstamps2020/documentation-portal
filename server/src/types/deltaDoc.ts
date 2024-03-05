export type DeltaDocResultType = {
  id: string;
  title: string;
  body: string;
};

export type DeltaDocInputType = {
  releaseA: string;
  releaseB: string;
  url: string;
};

export type DeltaLevenshteinReturnType = {
    URL: string;
    docATitle: string;
    docBTitle: string;
    changes: number;
    percentage: number;
  };