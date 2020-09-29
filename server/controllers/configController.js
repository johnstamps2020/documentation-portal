const fetch = require('node-fetch');
const fs = require('fs').promises;

async function getConfig() {
  try {
    if (process.env.DEV === 'yes') {
      console.log('Getting local config');
      const configPath = `${__dirname}/../../.teamcity/config/server-config.json`;
      const config = await fs.readFile(configPath, 'utf-8');
      const json = JSON.parse(config);
      
      const docs = json.docs.filter(d =>
        d.environments.includes(process.env.DEPLOY_ENV)
      );
      
      const productFamilies = json.productFamilies;
      const localConfig = { docs: docs, productFamilies: productFamilies };
      return localConfig;
    } else {
      const result = await fetch(
        `${process.env.DOC_S3_URL}/portal-config/config.json`
      );
      const json = await result.json();
      return json;
    }
  } catch (err) {
    console.log(err);
    return { docs: [] };
  }
}

module.exports = getConfig;
