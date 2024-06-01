export type ChatbotDocument = {
  document: string;
  url: string;
  title: string;
};

export type ChatbotResponse = {
  response: string;
  original_documents: ChatbotDocument[];
};

export type ChatbotFilters = {
  product?: string;
  platform?: string;
  version?: string;
  release?: string;
  subject?: string;
  language?: string;
  doc_title?: string;
  internal?: string;
  public?: string;
};

export type FilterName = keyof ChatbotFilters;

export type ChatbotRequest = ChatbotFilters & {
  query: string;
  opt_in: boolean;
};

export type ChatbotMessage = {
  message: string | undefined;
  role: 'user' | 'bot';
  sources?: ChatbotDocument[];
};