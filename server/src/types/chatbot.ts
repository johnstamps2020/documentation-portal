export type ChatbotResponse = {
  text: string;
};

export type ChatbotDocument = {
  body: string;
  doc_display_title?: string;
  doc_id: string;
  filters: ChatbotDocumentMetadataFilters;
  href: string;
  id: string;
  indexed_date: Date;
  title: string;
  titlePlain: string;
};

export type ChatbotMessage = {
  answer: string;
  sources: ChatbotDocument[];
};

export type ChatbotDocumentMetadataFilters = {
  platform?: string[];
  product: string[];
  version: string[];
  release?: string[];
  subject?: string[];
  langauge: string[];
  internal: boolean;
  public: boolean;
  doc_title?: string;
};

export type ChatbotRequest = {
  prompt: string;
  conversationId?: string;
  conversationSoFar?: {
    actor: 'bot' | 'user';
    message: string;
  }[];
  filters: ChatbotDocumentMetadataFilters;
};

export type ChatbotSearch = {
  query: string;
  filters: ChatbotDocumentMetadataFilters;
};
