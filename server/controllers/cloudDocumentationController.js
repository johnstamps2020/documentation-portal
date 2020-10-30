const getConfig = require('./configController');
const cloudTaxonomy = require('../../.teamcity/config/taxonomy/cloud.json');
const getId = require('./utils').getId;
const { getUniqueInMetadataArrays } = require('../routes/helpers/metadata');

async function getCloudDocs() {
  const serverConfig = await getConfig();
  const docs = serverConfig.docs;
  return docs.filter(doc => doc.metadata.platform.includes('Cloud'));
}

function hasDocs(node, docs) {
  if (typeof node === 'string') {
    if (docs.some(d => d.metadata.product.includes(node))) {
      return true;
    }
  } else {
    for (const child of Object.values(node)[0]) {
      if (hasDocs(child, docs)) {
        return true;
      }
    }
  }

  return false;
}

function getTaxonomyLabelIfNotEmpty(taxonomyObject, docs) {
  if (hasDocs(taxonomyObject, docs)) {
    return Object.keys(taxonomyObject)[0];
  }
}

function getTaxonomyLabels(taxonomyObject, docs) {
  return taxonomyObject
    .map(p => getTaxonomyLabelIfNotEmpty(p, docs))
    .filter(Boolean);
}

async function getCloudProductPageInfo() {
  try {
    const cloudDocs = await getCloudDocs();

    const pageTitle = Object.keys(cloudTaxonomy)[0];
    const productFamilies = getTaxonomyLabels(
      cloudTaxonomy[pageTitle],
      cloudDocs
    ).map(p => ({
      label: p,
      link: `products/${getId(p)}`,
    }));

    const cloudProductPageInfo = {
      title: pageTitle,
      productFamilies: productFamilies,
    };

    return cloudProductPageInfo;
  } catch (err) {
    console.log(err);
  }
}

function getTaxonomyTree(taxonomyObject, docs) {
  if (typeof taxonomyObject === 'string') {
    if (hasDocs(taxonomyObject, docs)) {
      return taxonomyObject;
    } else {
      return undefined;
    }
  } else {
    const newChildren = [];
    for (let child of Object.values(taxonomyObject)[0]) {
      newChildren.push(getTaxonomyTree(child, docs));
    }
    return { [Object.keys(taxonomyObject)[0]]: newChildren.filter(Boolean) };
  }
}

async function getProductFamilyPageInfo(familyId) {
  try {
    const cloudDocs = await getCloudDocs();

    const root = Object.keys(cloudTaxonomy)[0];
    const productFamily = cloudTaxonomy[root].find(
      f => getId(Object.keys(f)[0]) === familyId
    );

    const pageTitle = Object.keys(productFamily)[0];
    const productTree = productFamily[pageTitle].map(p =>
      getTaxonomyTree(p, cloudDocs)
    );

    const productFamilyPageInfo = {
      pageTitle: pageTitle,
      productTree: productTree,
    };

    return productFamilyPageInfo;
  } catch (err) {
    console.log(err);
  }
}

function getProductsFromTree(node, aggregator) {
  console.log('NODE:', node);
  if (typeof node === 'string') {
    aggregator.push(node);
  } else {
    for (const child of Object.values(node)[0]) {
      getProductsFromTree(child, aggregator);
    }
  }
}

async function getHighestRelease(familyId) {
  const productFamilyInfo = await getProductFamilyPageInfo(familyId);
  const productTree = productFamilyInfo.productTree;
  const productList = [];
  for (const item of productTree) {
    getProductsFromTree(item, productList);
  }

  const cloudDocs = await getCloudDocs();

  console.log('RESULT:', productList);
}

module.exports = {
  getCloudProductPageInfo,
  getProductFamilyPageInfo,
  getHighestRelease,
};
