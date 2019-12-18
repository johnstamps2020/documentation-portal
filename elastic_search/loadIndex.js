const documents = require('../public/documents.json');
const client = require('./elasticClient');

async function run() {
  for (i = 0; i < documents.length; i++) {
    const obj = documents[i];
    await client.index({
      index: 'gw-docs',
      body: {
        title: obj.title,
        body: obj.body,
        id: obj.id,
      },
    });
  }

  await client.indices.refresh({ index: 'gw-docs' });

  const { body } = await client.search({
    index: 'gw-docs',
    body: {
      query: {
        match: { body: 'Guidewire' },
      },
    },
  });

  console.log(body.hits.hits);
  if (body.hits.hits.length < 1) {
    throw 'Finished indexing, but the query ';
  }
}

run().catch(console.log);
