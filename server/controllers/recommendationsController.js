require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { isRequestAuthenticated } = require('./authController');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const recommendationsIndexName = 'gw-recommendations';

async function getTopicRecommendations(topicId) {
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
      return {
        body: {
          topicId: topicId,
          recommendations: hit.recommendations,
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
