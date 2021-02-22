const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const { findNodeById } = require('./helpers/taxonomy');

const localConfigDir = path.resolve(`${__dirname}/../../.teamcity/config`);

async function getConfig() {
  try {
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local config for the "${process.env.DEPLOY_ENV}" environment`
      );
      const configPath = path.join(localConfigDir, 'server-config.json');
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

async function getTaxonomy(release) {
  try {
    const taxonomyFile = release
      ? `cloud/${release}.json`
      : 'self-managed.json';
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local taxonomy for the "${process.env.DEPLOY_ENV}" environment`
      );
      const taxonomyFilePath = path.join(
        localConfigDir,
        `taxonomy/${taxonomyFile}`
      );
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
      const taxonomyDir = path.join(localConfigDir, 'taxonomy/cloud');
      taxonomyFiles = await fs.readdir(taxonomyDir);
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
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const config = await getConfig();
  const matchingDoc = config.docs.find(d =>
    relativeUrl.startsWith(d.url + '/')
  );

  if (matchingDoc && matchingDoc.public) {
    return true;
  }

  return false;
}

async function getVersionsForProductOnPlatform(product, platform, isLoggedIn) {
  const config = await getConfig();
  const docs = config.docs;
  const matchingDocs = docs.filter(
    d =>
      d.metadata.platform.some(p => p === platform) &&
      d.metadata.product.some(p => p === product)
  );

  console.log('THE USER I LOGGED IN ===============', isLoggedIn);

  let versions = [];
  for (const doc of matchingDocs) {
    for (const version of doc.metadata.version) {
      if (!versions.some(v => v.label === version)) {
        const isAbsoluteLink =
          doc.url.startsWith('http://') || doc.url.startsWith('https://');
        const url = isAbsoluteLink ? doc.url : '/' + doc.url;
        const link = isLoggedIn ? url : doc.public ? url : undefined;
        versions.push({
          label: version,
          link: link,
          public: doc.public,
        });
      }
    }
  }

  versions.sort((a, b) => (a.label < b.label ? 1 : -1));

  return versions;
}

module.exports = {
  getConfig,
  getTaxonomy,
  getReleasesFromTaxonomies,
  isPublicDoc,
  getVersionsForProductOnPlatform,
};
