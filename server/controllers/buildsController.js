const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: 'http://localhost:9200' });
const buildsIndexName = 'builds';

async function getBuilds(buildId) {
  try {
    let queryBody;
    if (buildId) {
      queryBody = {
        query: {
          match: {
            build_id: buildId,
          },
        },
      };
    } else {
      queryBody = {
        query: {
          match_all: {},
        },
      };
    }

    const response = await elasticClient.search({
      index: buildsIndexName,
      size: 10000,
      body: queryBody,
    });
    const hits = response.body.hits.hits;
    return hits.map(h => h._source);
  } catch (err) {
    console.log(err);
    return { builds: [] };
  }
}

async function addBuild(reqBody) {
  try {
    const response = elasticClient.index({
      index: buildsIndexName,
      body: reqBody,
    });
    return response;
  } catch (err) {
    console.log(err);
    return `Build not added. Error: ${err}`;
  }
}

async function deleteBuild(buildId) {}

module.exports = {
  getBuilds,
  addBuild,
};
