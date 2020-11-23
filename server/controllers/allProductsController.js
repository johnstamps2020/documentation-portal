const getConfig = require('./configController');
const {
  getUniqueInMetadataFields,
  getSortedVersions,
} = require('./helpers/metadata');
const { findNodeById } = require('./helpers/taxonomy');
const fs = require('fs').promises;
const path = require('path');

async function findProductRoute(productId, productVersion) {
  const cloudTaxonomyDir = `${__dirname}/../../.teamcity/config/taxonomy/cloud`;
  const cloudTaxonomyFiles = (await fs.readdir(cloudTaxonomyDir)).filter(f =>
    f.endsWith('.json')
  );
  const sortedCloudTaxonomyFiles = getSortedVersions(cloudTaxonomyFiles);
  for (const taxonomyFile of sortedCloudTaxonomyFiles) {
    const taxonomyFilePath = path.join(cloudTaxonomyDir, taxonomyFile);
    const taxonomyFileContents = await fs.readFile(taxonomyFilePath, 'utf-8');
    const jsonTaxonomyContents = JSON.parse(taxonomyFileContents);
    for (const productFamily of jsonTaxonomyContents.items) {
      const productNode = findNodeById(productId, productFamily);
      if (productNode) {
        const release = path.basename(taxonomyFile, '.json');
        const productFamilyId = productFamily.id;
        const productName = productNode.label;
        const serverConfig = await getConfig();
        const docs = serverConfig.docs;
        let productDocs = docs.filter(
          doc =>
            doc.metadata.platform.includes('Cloud') &&
            doc.metadata.product.includes(productName) &&
            doc.metadata.release.includes(release) &&
            doc.displayOnLandingPages !== false
        );
        const productVersions = getSortedVersions(
          getUniqueInMetadataFields(productDocs, 'version')
        );
        let highestProductVersion = productVersions[0];
        if (productVersion) {
          highestProductVersion = productVersions.filter(
            ver => ver === productVersion
          )[0];
        }
        if (highestProductVersion) {
          return `/cloudProducts/${release}/${productFamilyId}/${productId}/${highestProductVersion}`;
        }
      }
    }
  }
  const selfManagedTaxonomyFileContents = await fs.readFile(
    `${__dirname}/../../.teamcity/config/taxonomy/self-managed.json`,
    'utf-8'
  );
  const jsonSelfManagedTaxonomyFileContents = JSON.parse(
    selfManagedTaxonomyFileContents
  );
  const productNode = findNodeById(
    productId,
    jsonSelfManagedTaxonomyFileContents
  );
  if (productNode) {
    const productName = productNode.label;
    const serverConfig = await getConfig();
    const docs = serverConfig.docs;
    const productDocs = docs.filter(
      doc =>
        doc.metadata.platform.includes('Self-managed') &&
        doc.metadata.product.includes(productName) &&
        doc.displayOnLandingPages !== false
    );
    const productVersions = getSortedVersions(
      getUniqueInMetadataFields(productDocs, 'version')
    );
    let highestProductVersion = productVersions[0];
    if (productVersion) {
      highestProductVersion = productVersions.filter(
        ver => ver === productVersion
      )[0];
    }
    if (highestProductVersion) {
      return `/selfManagedProducts/${productId}/${highestProductVersion}`;
    }
  }
}

module.exports = {
  findProductRoute,
};
