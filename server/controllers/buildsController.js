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
    return hits.map(h => ({
      _id: h._id,
      build_id: h._source.build_id,
      resources: h._source.resources,
    }));
  } catch (err) {
    console.log(err);
    return { builds: [] };
  }
}

async function addOrUpdateBuild(reqBody) {
  try {
    const requestParams = {
      index: buildsIndexName,
      body: reqBody,
    };
    const buildsInfo = await getBuilds(reqBody.build_id);
    if (buildsInfo.length > 0) {
      requestParams.id = buildsInfo[0]._id;
    }
    const response = await elasticClient.index(requestParams);
    return {
      _id: response.body._id,
      result: response.body.result,
      status: response.statusCode,
    };
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function deleteBuild(buildId) {}

module.exports = {
  getBuilds,
  addOrUpdateBuild,
};
