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

async function getCloudDocumentationPageInfo() {
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

    const cloudDocumentationPageInfo = {
      title: pageTitle,
      productFamilies: productFamilies,
    };

    return cloudDocumentationPageInfo;
  } catch (err) {
    console.log(err);
  }
}

async function getProductFamilyPageInfo(productFamily) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const categories = [];
    for (const category of productFamily.items.filter(
      i => typeof i !== 'string'
    )) {
      const docs = [];
      getDocsForTaxonomy(category, cloudDocs, docs);
      if (docs) {
        categories.push({
          label: category.label,
          products: category.items.keys(),
        });
      }
    }

    const productFamilyPageInfo = {
      title: productFamily.label,
      categories: categories,
    };
    return productFamilyPageInfo;
  } catch (err) {
    console.log(err);
  }
}

async function getProductFamilyPages() {
  const productFamiliesWithDocs = (await getCloudDocumentationPageInfo())
    .productFamilies;
  const productFamilyPages = [];
  for (const productFamily of productFamiliesWithDocs) {
    const productFamilyObject = cloudTaxonomy.items.find(
      p => p.label === productFamily.label
    );
    const productFamilyPageInfo = await getProductFamilyPageInfo(
      productFamilyObject
    );
    productFamilyPages.push(productFamilyPageInfo);
  }
  return productFamilyPages;
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

getProductFamilyPages().then(r => r);

module.exports = {
  getCloudDocumentationPageInfo,
  getProductFamilyPages,
  getHighestRelease,
};
