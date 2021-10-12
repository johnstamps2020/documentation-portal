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

    const recommendationsResults = await elasticClient.search({
      index: recommendationsIndexName,
      body: {
        query: queryBody,
      },
    });

    return {
      topicId: topicId,
      recommendations: recommendationsResults.body.hits.hits[0].recommendations,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { getTopicRecommendations };
