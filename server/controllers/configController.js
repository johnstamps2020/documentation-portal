const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const { findNodeById } = require('./helpers/taxonomy');
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const serverConfigIndexName = 'server-config';

async function getDocs(queryBody, indexName = serverConfigIndexName) {
  try {
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local config for the "${process.env.DEPLOY_ENV}" environment`
      );
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
      const searchResults = await elasticClient.search({
        index: indexName,
        size: 10000,
        body: queryBody,
      });
      const hits = searchResults.body.hits.hits;
      let docs = [];
      for (const hit of hits) {
        docs.push(hit._source);
      }
      return docs;
    }
  } catch (err) {
    console.log(err);
    return { docs: [] };
  }
}

async function getTaxonomy(release) {
  try {
    const taxonomyFile = release
      ? `cloud/${release}.json`
      : 'self-managed.json';
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local taxonomy for the "${process.env.DEPLOY_ENV}" environment`
      );
      const taxonomyFilePath = `${__dirname}/../../.teamcity/config/taxonomy/${taxonomyFile}`;
      const taxonomy = await fs.readFile(taxonomyFilePath, 'utf-8');
      const json = JSON.parse(taxonomy);
      return json;
    } else {
      const result = await fetch(
        `${process.env.DOC_S3_URL}/portal-config/taxonomy/${taxonomyFile}`
      );
      const json = await result.json();
      return json;
    }
  } catch (err) {
    console.log(err);
  }
}

async function getReleasesFromTaxonomies(filterId) {
  try {
    let taxonomyFiles;
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting releases from local taxonomies for the "${process.env.DEPLOY_ENV}" environment`
      );
      taxonomyFiles = await fs.readdir(
        `${__dirname}/../../.teamcity/config/taxonomy/cloud`
      );
    } else {
      const result = await fetch(
        `${process.env.DOC_S3_URL}/portal-config/taxonomy/cloud/index.json`
      );
      const json = await result.json();
      taxonomyFiles = json.paths;
    }
    const availableReleases = [];
    for (const file of taxonomyFiles.filter(f => f.endsWith('.json'))) {
      const release = path.basename(file, '.json');
      if (!filterId) {
        availableReleases.push(release);
      } else {
        const taxonomyFromFile = await getTaxonomy(release);
        if (findNodeById(filterId, taxonomyFromFile)) {
          availableReleases.push(release);
        }
      }
    }
    return availableReleases;
  } catch (err) {
    console.log(err);
  }
}

async function isPublicDoc(url) {
  let relativeUrl = url;
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const docs = await getDocs();
  const matchingDoc = docs.find(d => relativeUrl.startsWith(d.url));

  if (matchingDoc && matchingDoc.public) {
    return true;
  }

  return false;
}

module.exports = {
  getDocs,
  getTaxonomy,
  getReleasesFromTaxonomies,
  isPublicDoc,
};
