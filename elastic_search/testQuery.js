const client = require('./elasticClient');

async function run(searchQuery) {
  const { body } = await client.search({
    index: 'gw-docs',
    body: {
      query: {
        match: { body: searchQuery },
      },
    },
  });

  console.log(body.hits.hits);
  if (body.hits.hits.length < 1) {
    throw 'Finished indexing, but the query returned no results';
  }
}

run('Bitbucket').catch(console.log);
