import useSWR from 'swr';
import { ChatbotComment } from '../types';

export type FeedbackFilters = {
  status?: ChatbotComment['status'][];
  userReaction?: ChatbotComment['user']['reaction'][];
};

const feedbackGetter = async (
  filters?: FeedbackFilters
): Promise<ChatbotComment[]> => {
  try {
    const response = await fetch('/chatbot-comments');

    const responseObject = await response.json();
    if (!response.ok) {
      throw new Error(
        `The response failed. ${response.status}: ${JSON.stringify(
          responseObject,
          null,
          2
        )}`
      );
    }

    const filteredItems = (responseObject as ChatbotComment[]).filter(
      (item) => {
        if (!filters) {
          return true;
        }

        if (filters.status && !filters.status.includes(item.status)) {
          return false;
        }

        if (
          filters.userReaction &&
          !filters.userReaction.includes(item.user.reaction)
        ) {
          return false;
        }

        return true;
      }
    );

    filteredItems.sort((a, b) => (a.context.date > b.context.date ? -1 : 1));

    return filteredItems;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export function useChatbotFeedback(filters: FeedbackFilters) {
  const {
    data: feedbackItems,
    error,
    isLoading,
  } = useSWR<ChatbotComment[], string>(filters, feedbackGetter, {
    refreshInterval: 2000,
  });

  return {
    feedbackItems,
    isLoading,
    isError: error,
  };
}
