require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { getEntity } = require('./configController');
const { winstonLogger } = require('./loggerController');
const { DocConfig } = require('../model/entity/DocConfig');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const recommendationsIndexName = 'gw-recommendations';

async function showOnlyPublicRecommendations(reqObj, resObj, recommendations) {
  try {
    const publicRecommendations = [];
    for (const recommendation of recommendations) {
      const getEntityResult = await getEntity(DocConfig.name, {
        id: recommendation.doc_id,
      });
      const recommendationIsPublic =
        getEntityResult.status === 200 ? getEntityResult.body.public : false;
      if (recommendationIsPublic) {
        publicRecommendations.push(recommendation);
      }
    }
    return publicRecommendations;
  } catch (err) {
    winstonLogger.error(
      `Problem determining public recommendations
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function getTopicRecommendations(topicId, reqObj, resObj) {
  try {
    const indexExists = await elasticClient.indices.exists({
      index: recommendationsIndexName,
    });
    if (!indexExists.body) {
      return {
        body: `Cannot get recommendations for topic with ID "${topicId}". Index "${recommendationsIndexName}" does not exist.`,
        status: 404,
      };
    }
    const queryBody = {
      match: {
        id: {
          query: topicId,
        },
      },
    };

    const response = await elasticClient.search({
      index: recommendationsIndexName,
      body: {
        query: queryBody,
      },
    });
    const hit = response.body.hits.hits.map(h => ({
      ...h._source,
    }))[0];
    if (hit) {
      let topicRecommendations = hit.recommendations;
      const reqIsAuthenticated = reqObj.session.requestIsAuthenticated;
      if (!reqIsAuthenticated) {
        topicRecommendations = await showOnlyPublicRecommendations(
          reqObj,
          resObj,
          topicRecommendations
        );
      }
      if (topicRecommendations.length > 0) {
        return {
          body: {
            topicId: topicId,
            recommendations: topicRecommendations,
          },
          status: response.statusCode,
        };
      } else {
        return {
          body: {
            message: `No recommendations found for topic with ID "${topicId}"`,
          },
          status: 404,
        };
      }
    } else {
      return {
        body: {
          message: `Topic with ID "${topicId}" not found`,
        },
        status: 404,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Cannot get recommendations for topic ${topicId}
          ERROR: ${JSON.stringify(err)}`
    );
    return {
      body: err.message,
      status: 500,
    };
  }
}

module.exports = { getTopicRecommendations };
