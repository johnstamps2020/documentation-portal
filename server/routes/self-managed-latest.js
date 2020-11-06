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
  const docs = config.docs.filter(
    d =>
      d.metadata.platform.includes('Self-managed') &&
      d.displayOnLandingPages !== false
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

      const docsWithSubcategories = docsInCategory.filter(d =>
        d.metadata.hasOwnProperty('subcategory')
      );
      const subcategories = [];
      if (docsWithSubcategories) {
        for (const doc of docsWithSubcategories) {
          const docSubcategory = doc.metadata.subcategory;
          if (!subcategories.includes(docSubcategory)) {
            subcategories.push(docSubcategory);
          }
        }
      }

      const products = getUniqueInMetadataArrays(docsInCategory, 'product');
      for (const product of products) {
        docsInProduct = docsInCategory.filter(d =>
          d.metadata.product.includes(product)
        );

        const productSubcategory = docsInProduct.filter(d =>
          d.metadata.hasOwnProperty('subcategory')
        )[0]?.metadata.subcategory;

        let productUrl = '';
        if (docsInProduct.length === 1) {
          productUrl = `/${docsInProduct[0].url}`;
        } else if (docsInProduct.length > 1) {
          const version = getSortedVersions(
            getUniqueInMetadataFields(docsInProduct, 'version')
          )[0];
          productUrl = `self-managed-latest/${product}/${version}`;
        }

        linksForCategory.push({
          title: product,
          url: productUrl,
          subcategory: productSubcategory,
        });
      }

      if (linksForCategory.length > 0) {
        productLinks.push({
          category: category,
          subcategories: subcategories,
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

    if (docLinks.length === 1 && docLinks[0].docs.length === 1) {
      res.redirect('/' + docLinks[0].docs[0].url);
    } else {
      res.render('grouped-cards', {
        title: `${product} ${version}`,
        docGroups: docLinks,
        breadcrumb: [
          { href: `/self-managed-latest`, label: 'Self-managed documentation' },
        ],
        selectedRelease: version,
        availableReleases: sortedVersions,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
