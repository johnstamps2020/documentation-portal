const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: 'http://localhost:9200' });

async function getBuilds() {
  try {
    const searchResults = await elasticClient.search({
      index: 'builds',
      size: 10000,
      body: {
        query: {
          match_all: {},
        },
      },
    });
    const hits = searchResults.body.hits.hits;
    let builds = hits.map(h => h._source);
    return builds;
  } catch (err) {
    console.log(err);
    return { builds: [] };
  }
}

module.exports = {
  getBuilds,
};
