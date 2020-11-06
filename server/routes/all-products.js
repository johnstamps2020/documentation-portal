//TODO: Move logic for generating list of docs to the controller
const express = require('express');
const router = express.Router();
const getAllProductDocs = require('../controllers/allProductController');
const {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getSortedVersions,
} = require('../controllers/helpers/metadata');
const {
  getDefaultSubjectIcon,
  getSubjectIcon,
} = require('../controllers/helpers/icons');

async function getSingleProduct(productId) {
  const products = await getAllProductDocs();

  return products.find(product => product.id === productId);
}

async function getSingleProductVersion(productId, version) {
  let product = await getSingleProduct(productId);

  product.docs = product.docs.filter(doc => doc.metadata.version === version);
  return product;
}

router.get('/:productId', async function(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await getSingleProduct(productId);

    const availableVersions = getUniqueInMetadataFields(
      product.docs,
      'version'
    );

    const highestVersion = getSortedVersions(availableVersions)[0];

    res.redirect(`${req.params.productId}/${highestVersion}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:productId/:version', async function(req, res, next) {
  try {
    const { productId, version } = req.params;
    const allProductDocs = await getSingleProduct(productId);
    const productDocsForVersion = await getSingleProductVersion(
      productId,
      version
    );

    const availableVersions = getUniqueInMetadataFields(
      allProductDocs.docs,
      'version'
    );

    const sortedVersions = getSortedVersions(availableVersions);
    const docsInVersion = productDocsForVersion.docs;

    let docsBySubject = [];
    const availableSubjects = getUniqueInMetadataArrays(
      docsInVersion,
      'subject'
    );

    for (const subject of availableSubjects) {
      docsInSubject = docsInVersion.filter(d =>
        d.metadata.subject.includes(subject)
      );
      if (docsInSubject.length > 0) {
        docsBySubject.push({
          category: subject,
          docs: docsInSubject,
          icon: getSubjectIcon(subject),
        });
      }
    }

    const docsWithoutSubject = docsInVersion.filter(d => !d.metadata.subject);

    if (docsWithoutSubject && docsWithoutSubject.length > 0) {
      docsBySubject.push({
        category: 'Documents',
        docs: docsWithoutSubject,
        icon: getDefaultSubjectIcon(),
      });
    }

    if (docsBySubject.length === 1 && docsBySubject[0].docs.length === 1) {
      res.redirect('/' + docsBySubject[0].docs[0].url);
    } else {
      res.render('grouped-links', {
        title: `${productDocsForVersion.name} ${version}`,
        docGroups: docsBySubject,
        breadcrumb: [],
        selectedRelease: version,
        sortedVersions: sortedVersions,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
