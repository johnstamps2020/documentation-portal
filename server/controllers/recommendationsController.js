require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { isRequestAuthenticated } = require('./authController');
const { getConfig } = require('./configController');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const recommendationsIndexName = 'gw-recommendations';

async function requestIsAuthenticated(reqObj) {
  return !!(
    process.env.ENABLE_AUTH === 'no' || (await isRequestAuthenticated(reqObj))
  );
}

async function showOnlyPublicRecommendations(reqObj, recommendations) {
  const publicRecommendations = [];
  const config = await getConfig(reqObj);
  for (const recommendation of recommendations) {
    const matchingDoc = config.docs.find(
      d => d.doc_id === recommendation.doc_id
    );
    const recommendationIsPublic = matchingDoc ? matchingDoc.public : false;
    if (recommendationIsPublic) {
      publicRecommendations.push(recommendation);
    }
  }
  return publicRecommendations;
}

async function getTopicRecommendations(topicId, reqObj) {
  try {
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
      const reqIsAuthenticated = await requestIsAuthenticated(reqObj);
      if (!reqIsAuthenticated) {
        topicRecommendations = await showOnlyPublicRecommendations(
          reqObj,
          topicRecommendations
        );
      }
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
          message: `Topic with ID "${topicId}" not found`,
        },
        status: 404,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      body: err.message,
      status: 500,
    };
  }
}

module.exports = { getTopicRecommendations };
