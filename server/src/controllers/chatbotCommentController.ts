import { ChatbotComment } from '@doctools/components';
import { Client } from '@elastic/elasticsearch';
import { ApiResponse } from '../types';
import { winstonLogger } from './loggerController';
require('dotenv').config();

const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const indexName = 'chatbot';

export async function submitChatbotComment(
  chatbotComment: ChatbotComment
): Promise<ApiResponse> {
  try {
    const { id, ...otherProps } = chatbotComment;
    const result = await elasticClient.index({
      index: indexName,
      refresh: true,
      id,
      body: otherProps,
    });

    if (
      result.result &&
      result.result !== 'not_found' &&
      result.result !== 'noop'
    ) {
      return {
        status: 200,
        body: {
          message: `Your comment was ${result.result}.`,
          result,
        },
      };
    }

    return {
      status: 500,
      body: {
        message: 'Comment was not added. No response from the server.',
        result,
      },
    };
  } catch (error) {
    const errorMessage = `Error when posting a chatbot comment to Elastic: ${error}`;
    winstonLogger.error(errorMessage);

    return {
      status: 500,
      body: {
        message: errorMessage,
      },
    };
  }
}

export async function getChatbotComments(): Promise<ApiResponse> {
  try {
    const result = await elasticClient.search({
      index: indexName,
      size: 1000,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    return {
      status: 200,
      body: result.hits.hits.map((hit) => {
        const otherProps = hit._source as Omit<ChatbotComment, 'id'>;
        return { id: hit._id, ...otherProps };
      }),
    };
  } catch (error) {
    const errorMessage = `Error when posting a chatbot comment to Elastic: ${error}`;
    winstonLogger.error(errorMessage);

    return {
      status: 500,
      body: {
        message: errorMessage,
      },
    };
  }
}

export async function deleteAllChatbotComments(): Promise<ApiResponse> {
  try {
    const result = await elasticClient.deleteByQuery({
      index: indexName,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    return {
      status: 200,
      body: {
        message: `All comments deleted.`,
        result,
      },
    };
  } catch (error) {
    const errorMessage = `Error deleting all comments: ${error}`;
    winstonLogger.error(errorMessage);

    return {
      status: 500,
      body: {
        message: errorMessage,
      },
    };
  }
}
