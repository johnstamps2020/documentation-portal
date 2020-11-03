const getConfig = require('./configController');
const cloudTaxonomy = require('../../.teamcity/config/taxonomy/cloud.json');
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
          link: `products/${productFamily.id.toLowerCase()}`,
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

async function getProductFamilyPageInfo(productFamilyId) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const productFamily = cloudTaxonomy.items.find(
      i => i.id.toLowerCase() === productFamilyId
    );
    const docs = [];
    getDocsForTaxonomy(productFamily, cloudDocs, docs);
    if (docs) {
      const categories = [];
      for (const productFamilyItem of productFamily.items.filter(
        i => typeof i !== 'string'
      )) {
        const categoryGroups = productFamilyItem.items.filter(
          i => typeof i !== 'string'
        );
        const categoryDocs = productFamilyItem.items.filter(
          i => typeof i === 'string'
        );
        categories.push({
          label: productFamilyItem.label,
          groups: categoryGroups,
          docs: categoryDocs,
        });
      }
      return {
        title: productFamily.label,
        categories: categories,
      };
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getCloudDocumentationPageInfo,
  getProductFamilyPageInfo,
};
