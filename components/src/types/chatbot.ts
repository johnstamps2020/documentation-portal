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

export type ChatbotConversationHistory = {
  conversation_history: {
    question: string;
    answer: string;
  }[];
};

export type FilterName = keyof ChatbotFilters;

export type ChatbotRequest = ChatbotFilters &
  ChatbotConversationHistory & {
    query: string;
    opt_in: boolean;
  };

export type ChatbotMessage = {
  message: string | undefined;
  role: 'user' | 'bot';
  sources?: ChatbotDocument[];
  millisecondsItTook: number;
};

export type ChatbotComment = {
  id: string;
  status: 'active' | 'archived';
  context: {
    chatbotRequest: ChatbotRequest;
    chatbotMessage: ChatbotMessage;
    date: number;
  };
  user: {
    reaction: 'positive' | 'negative' | 'unset';
    comment?: string;
    email?: string;
  };
};
