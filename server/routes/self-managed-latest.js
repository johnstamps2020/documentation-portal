const express = require('express');
const router = express.Router();
const getConfig = require('../controllers/configController');
const {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getHighestVersion,
} = require('./helpers/metadata');

async function getSelfManagedDocs() {
  const config = await getConfig();
  const docs = config.docs.filter(d =>
    d.metadata.platform.includes('Self-managed')
  );

  return docs;
}

router.get('/', async function(req, res, next) {
  try {
    const docs = await getSelfManagedDocs();
    const categories = getUniqueInMetadataArrays(docs, 'category');

    let productLinks = [];
    for (const category of categories) {
      let linksForCategory = [];
      const docsInCategory = docs.filter(d =>
        d.metadata.category.includes(category)
      );
      const products = getUniqueInMetadataArrays(docsInCategory, 'products');
      for (const product of products) {
        docsInProduct = docsInCategory.filter(d =>
          d.metadata.products.includes(product)
        );
        if (docsInProduct.length === 1) {
          const onlyVersion = docsInProduct[0].metadata.version;
          linksForCategory.push({
            title: `${product} ${onlyVersion}`,
            url: `/${docsInProduct[0].url}`,
          });
        }

        if (docsInProduct.length > 1) {
          const version = getHighestVersion(
            getUniqueInMetadataFields(docsInProduct, 'version')
          );
          linksForCategory.push({
            title: product,
            url: `self-managed-latest/${product}/${version}`,
          });
        }
      }

      if (linksForCategory.length > 0) {
        productLinks.push({
          category: category,
          docs: linksForCategory,
        });
      }
    }

    res.render('self-managed-latest', {
      docGroups: productLinks,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:product/:version', async function(req, res, next) {
  try {
    const { product, version } = req.params;
    const docs = await getSelfManagedDocs();

    const docsInProduct = docs.filter(d =>
      d.metadata.products.includes(product)
    );
    const versions = getUniqueInMetadataFields(docsInProduct, 'version');

    const docsInVersion = docsInProduct.filter(
      d => d.metadata.version === version
    );
    console.log('DOCS IN VERSION', docsInVersion);

    let docLinks = [];
    for (const category of getUniqueInMetadataArrays(
      docsInVersion,
      'category'
    )) {
      const docsInCategory = docsInVersion.filter(d =>
        d.metadata.category.includes(category)
      );
      docLinks.push({
        category: category,
        docs: docsInCategory,
      });
    }

    res.render('grouped-cards', {
      title: `${product} ${version}`,
      docGroups: docLinks,
      returnUrl: `/self-managed-latest`,
      returnLabel: `Back to self-managed products`,
      selectedRelease: version,
      availableReleases: versions,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
