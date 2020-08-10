const fetch = require('node-fetch');

async function getConfig() {
  try {
    const result = await fetch(
      `${process.env.DOC_S3_URL}/portal-config/config.json`
    );
    const json = await result.json();
    return json;
  } catch (err) {
    return { docs: [] };
  }
}

module.exports = getConfig;
