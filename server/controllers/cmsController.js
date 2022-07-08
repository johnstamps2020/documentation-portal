const fetch = require('node-fetch-retry');

async function getSimpleDoc(docId, contentId) {
  const response = await fetch(
    `http://localhost:1337/api/simple-docs/${docId}?populate=topic`
  );
  const json = await response.json();
  const topic = json.data.attributes.topic;
  const simpleDocLinks = topic.map(i => `/cms/${docId}/${i.id}`);
  const simpleDocContent = topic.find(i => i.id === parseInt(contentId))
    .content;
  return {
    simpleDocLinks: simpleDocLinks,
    simpleDocContent: simpleDocContent,
  };
}

module.exports = { getSimpleDoc };
