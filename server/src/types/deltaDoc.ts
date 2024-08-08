export type DeltaDocTopicType = {
  id: string;
  title: string;
  body: string;
};

export type DeltaDocReturnType = {
  status: number;
  body: {
    [x: string]: {
      base_url: any;
      topics: DeltaDocTopicType[];
    };
  };
};

export type DeltaDocInputType = {
  firstDocId: string;
  secondDocId: string;
};

export type DeltaLevenshteinReturnType = {
  docAUrl: string;
  docBUrl: string;
  docATitle: string;
  docBTitle: string;
  changes: number;
  percentage: number;
};
