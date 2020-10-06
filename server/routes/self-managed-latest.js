const express = require('express');
const router = express.Router();
const getConfig = require('../controllers/configController');
const {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getSortedVersions,
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
      const products = getUniqueInMetadataArrays(docsInCategory, 'product');
      for (const product of products) {
        docsInProduct = docsInCategory.filter(d =>
          d.metadata.product.includes(product)
        );
        if (docsInProduct.length === 1) {
          linksForCategory.push({
            title: `${product}`,
            url: `/${docsInProduct[0].url}`,
          });
        }

        if (docsInProduct.length > 1) {
          const version = getSortedVersions(
            getUniqueInMetadataFields(docsInProduct, 'version')
          )[0];
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
      d.metadata.product.includes(product)
    );
    const versions = getUniqueInMetadataFields(docsInProduct, 'version');
    const sortedVersions = getSortedVersions(versions);

    const docsInVersion = docsInProduct.filter(
      d => d.metadata.version === version
    );

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
      breadcrumb: [
        { href: `/self-managed-latest`, label: 'Self-managed documentation' },
      ],
      selectedRelease: version,
      availableReleases: sortedVersions,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
