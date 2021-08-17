const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: process.env.CONFIG_DB_URL });
const buildsIndexName = 'builds';

async function getAllBuilds() {
  try {
    const response = await elasticClient.search({
      index: buildsIndexName,
      size: 10000,
      body: {
        query: {
          match_all: {},
        },
      },
    });
    const hits = response.body.hits.hits.map(h => ({
      _id: h._id,
      ...h._source,
    }));
    return {
      body: hits,
      status: response.statusCode,
    };
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

async function getBuildById(buildId) {
  try {
    const response = await elasticClient.search({
      index: buildsIndexName,
      size: 10000,
      body: {
        query: {
          match: {
            build_id: buildId,
          },
        },
      },
    });
    const hit = response.body.hits.hits.map(h => ({
      _id: h._id,
      ...h._source,
    }))[0];
    if (hit) {
      return {
        body: hit,
        status: response.statusCode,
      };
    } else {
      return {
        body: {
          message: `Build with ID "${buildId}" not found`,
        },
        status: 404,
      };
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

async function getBuildsByResources(gitRepoUrl, gitRepoBranch, resources) {
  try {
    const response = await elasticClient.search({
      index: buildsIndexName,
      size: 10000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  git_url: gitRepoUrl,
                },
              },
              {
                term: {
                  git_branch: gitRepoBranch,
                },
              },
              {
                terms: {
                  resources: resources,
                },
              },
            ],
          },
        },
      },
    });
    const hits = response.body.hits.hits.map(h => ({
      _id: h._id,
      ...h._source,
    }));
    return {
      body: hits,
      status: response.statusCode,
    };
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

async function addOrUpdateBuild(reqBody) {
  try {
    const requestParams = {
      index: buildsIndexName,
      body: reqBody,
    };
    const buildInfo = await getBuildById(reqBody.build_id);
    const buildUniqueId = buildInfo.body._id;
    if (buildUniqueId) {
      requestParams.id = buildUniqueId;
    }
    const response = await elasticClient.index(requestParams);
    return {
      body: {
        _id: response.body._id,
        result: response.body.result,
      },
      status: response.statusCode,
    };
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

async function deleteBuild(buildId) {
  try {
    const buildInfo = await getBuildById(buildId);
    const buildUniqueId = buildInfo.body._id;
    if (buildUniqueId) {
      const response = await elasticClient.delete({
        index: buildsIndexName,
        id: buildUniqueId,
      });
      return {
        body: {
          _id: response.body._id,
          result: response.body.result,
        },
        status: response.statusCode,
      };
    } else {
      return buildInfo;
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

module.exports = {
  getAllBuilds,
  getBuildById,
  getBuildsByResources,
  addOrUpdateBuild,
  deleteBuild,
};
