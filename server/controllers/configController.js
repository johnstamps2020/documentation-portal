const fetch = require('node-fetch');

async function getConfig() {
  const result = await fetch(
    `${process.env.DOC_S3_URL}/portal-config/config.json`
  );
  const json = await result.json();
  return json;
}

module.exports = getConfig;
