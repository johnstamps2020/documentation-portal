import { ApiResponse } from '../types/apiResponse';
import { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';
import { findEntity } from './configController';

import { Doc } from '../model/entity/Doc';
import { isUserAllowedToAccessResource } from './authController';

require('dotenv').config();

const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const recommendationsIndexName = 'gw-recommendations';

export async function getTopicRecommendations(
  req: Request,
  res: Response
): Promise<ApiResponse> {
  try {
    const { topicId } = req.query;
    if (!topicId) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the "topicId" query parameter to get breadcrumbs.',
        },
      };
    }
    const indexExistsResult = await elasticClient.indices.exists({
      index: recommendationsIndexName,
    });
    if (!indexExistsResult.body) {
      return {
        status: 404,
        body: {
          message: `Cannot get recommendations for topic with ID "${topicId}". Index "${recommendationsIndexName}" does not exist.`,
        },
      };
    }

    const response = await elasticClient.search({
      index: recommendationsIndexName,
      body: {
        query: {
          match: {
            id: {
              query: topicId,
            },
          },
        },
      },
    });
    const hit = response.body.hits.hits.map(
      (h: { _source: any }) => h._source
    )[0];
    if (hit) {
      let topicRecommendations = hit.recommendations;
      const availableRecommendations = [];
      for (const topicRecommendation of topicRecommendations) {
        const findTopicRecommendationResult = await findEntity(
          Doc.name,
          {
            id: topicRecommendation.doc_id,
          },
          false
        );
        if (findTopicRecommendationResult.status === 200) {
          const docInfo = findTopicRecommendationResult.body;
          const isUserAllowedToAccessResourceResult =
            isUserAllowedToAccessResource(
              res,
              docInfo.public,
              docInfo.internal,
              docInfo.isInProduction
            );
          if (isUserAllowedToAccessResourceResult.status === 200) {
            availableRecommendations.push(topicRecommendation);
          }
        }
      }
      if (availableRecommendations.length > 0) {
        return {
          status: 200,
          body: {
            topicId: topicId,
            recommendations: availableRecommendations,
          },
        };
      }
      return {
        status: 404,
        body: {
          message: `No recommendations found for topic with ID "${topicId}"`,
        },
      };
    }
    return {
      status: 404,
      body: {
        message: `Topic with ID "${topicId}" not found`,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}
