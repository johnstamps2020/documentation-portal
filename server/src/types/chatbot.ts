export type ChatbotDocument = {
  document: string;
  url: string;
  title: string;
};

export type ChatbotResponse = {
  response: string;
  original_documents: ChatbotDocument[];
};

export type ChabotFilters = {
  product?: string;
  platform?: string;
  version?: string;
  release?: string;
  subject?: string;
  language?: string;
  doc_title?: string;
  internal?: boolean;
  public?: boolean;
};

export type ChatbotRequest = ChabotFilters & {
  query: string;
  opt_in: boolean;
};
