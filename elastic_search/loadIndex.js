const { Client } = require('@elastic/elasticsearch');
const documents = require('../public/documents.json');

const client = new Client({ node: 'http://localhost:9200' });

async function run() {
    for (i = 0; i < documents.length; i++) {
        const obj = documents[i];
        await client
            .index({
                index: 'gw-docs',
                body: {
                    title: obj.title,
                    body: obj.body,
                    id: obj.id
                },
            })
    }

  await client.indices.refresh({ index: 'gw-docs' });

  const { body } = await client.search({
    index: 'gw-docs',
    body: {
      query: {
        match: { body: 'Bitbucket' },
      },
    },
  });

  console.log(body.hits.hits);
}

run().catch(console.log);
