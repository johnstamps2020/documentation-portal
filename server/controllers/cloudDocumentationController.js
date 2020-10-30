const getConfig = require('./configController');
const cloudTaxonomy = require('../../.teamcity/config/taxonomy/cloud.json');
const getId = require('./utils').getId;

function getProductFamilyIfNotEmpty(productFamily, docs) {
  if (hasDocs(productFamily, docs)) {
    return Object.keys(productFamily)[0];
  }
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

async function getCloudProductPageInfo() {
  try {
    const serverConfig = await getConfig();
    const docs = serverConfig.docs;
    const cloudDocs = docs.filter(doc =>
      doc.metadata.platform.includes('Cloud')
    );

    const pageTitle = Object.keys(cloudTaxonomy)[0];
    const productFamilies = cloudTaxonomy[pageTitle]
      .map(p => {
        const productFamilyLabel = getProductFamilyIfNotEmpty(p, cloudDocs);
        if (productFamilyLabel) {
          return {
            label: productFamilyLabel,
            link: `products/${getId(productFamilyLabel)}`,
          };
        }
      })
      .filter(Boolean);

    const cloudProductPageInfo = {
      title: pageTitle,
      productFamilies: productFamilies,
    };

    return cloudProductPageInfo;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getCloudProductPageInfo };
