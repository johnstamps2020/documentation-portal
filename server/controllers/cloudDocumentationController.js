const getConfig = require('./configController');
const cloudTaxonomy = require('../../.teamcity/config/taxonomy/cloud.json');
const getId = require('./utils').getId;
const { getUniqueInMetadataArrays } = require('../routes/helpers/metadata');

async function getCloudDocsFromConfig() {
  const serverConfig = await getConfig();
  const docs = serverConfig.docs;
  return docs.filter(doc => doc.metadata.platform.includes('Cloud'));
}

function getDocsForTaxonomy(node, docsFromConfig, matchingDocs) {
  if (typeof node === 'string') {
    if (docsFromConfig.some(d => d.metadata.product.includes(node))) {
      const filteredDocs = docsFromConfig.filter(d =>
        d.metadata.product.includes(node)
      );
      matchingDocs.push.apply(matchingDocs, filteredDocs);
    }
  } else {
    for (const child of node.items) {
      getDocsForTaxonomy(child, docsFromConfig, matchingDocs);
    }
  }
}

async function getCloudProductPageInfo() {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const pageTitle = cloudTaxonomy.label;
    const productFamilies = [];
    for (const productFamily of cloudTaxonomy.items) {
      const docs = [];
      getDocsForTaxonomy(productFamily, cloudDocs, docs);
      if (docs.length === 1) {
        productFamilies.push({
          label: productFamily.label,
          link: docs[0].url,
        });
      } else if (docs.length > 1) {
        productFamilies.push({
          label: productFamily.label,
          link: `products/${getId(productFamily.label)}`,
        });
      }
    }

    const cloudProductPageInfo = {
      title: pageTitle,
      productFamilies: productFamilies,
    };

    return cloudProductPageInfo;
  } catch (err) {
    console.log(err);
  }
}

async function getProductFamilyPageInfo(familyId) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const root = Object.keys(cloudTaxonomy)[0];
    const productFamily = cloudTaxonomy[root].find(
      f => getId(Object.keys(f)[0]) === familyId
    );

    const pageTitle = Object.keys(productFamily)[0];
    const productTree = productFamily[pageTitle].map(p =>
      getTaxonomyTree(p, cloudDocs)
    );

    const productFamilyPageInfo = {
      title: pageTitle,
      productTree: productTree,
    };
    console.log('ProductFamilePageInfo', productFamilyPageInfo);
    return productFamilyPageInfo;
  } catch (err) {
    console.log(err);
  }
}

async function getHighestRelease(familyId) {
  const productFamilyInfo = await getProductFamilyPageInfo(familyId);
  const productTree = productFamilyInfo.productTree;
  const productList = [];
  for (const item of productTree) {
    getProductsFromTree(item, productList);
  }

  const cloudDocs = await getCloudDocsFromConfig();

  console.log('RESULT:', productList);
}

module.exports = {
  getCloudProductPageInfo,
  getProductFamilyPageInfo,
  getHighestRelease,
};
