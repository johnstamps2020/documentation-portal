import { ChatbotComment, ChatbotMessage, ChatbotRequest } from '../../../types';

function makeHash(message: string) {
  var hash = 0,
    i,
    chr;
  if (message.length === 0) return hash;
  for (i = 0; i < message.length; i++) {
    chr = message.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  if (hash < 0) {
    return hash * -1;
  }

  return hash;
}

export async function postNewComment(
  chatbotRequest: ChatbotRequest,
  chatbotMessage: ChatbotMessage,
  reaction: ChatbotComment['user']['reaction'],
  userEmail?: string
): Promise<{
  postedComment: ChatbotComment | undefined;
  problem: string | undefined;
}> {
  try {
    const currentMillisecondsFromEpoch = new Date().getTime();
    const id = `${currentMillisecondsFromEpoch}-${Math.floor(
      Math.random() * 1000
    )}-${makeHash(chatbotRequest.query)}`;
    const commentData: ChatbotComment = {
      context: {
        chatbotMessage,
        chatbotRequest,
        date: currentMillisecondsFromEpoch,
      },
      id,
      status: 'active',
      user: {
        reaction,
        email: userEmail,
      },
    };

    const problem = await postComment(commentData);

    return {
      postedComment: commentData,
      problem,
    };
  } catch (err) {
    return {
      postedComment: undefined,
      problem: `${err}`,
    };
  }
}

export async function postComment(
  comment: ChatbotComment
): Promise<string | undefined> {
  try {
    const response = await fetch('/chatbot-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });

    const apiResponse: { message: string } = await response.json();

    if (!response.ok) {
      return apiResponse.message;
    }
  } catch (err) {
    return `${err}`;
  }
}
