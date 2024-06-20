import { ChatbotComment } from '../../../types';

export async function postComment(
  comment: ChatbotComment
): Promise<string | void> {
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
