const express = require('express');
const router = express.Router();
const getCloudProductFamilies = require('../controllers/cloudProductFamilyController');
const {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getSortedVersions,
} = require('./helpers/metadata');
const {
  getDefaultSubjectIcon,
  getSubjectIcon
} = require('./helpers/icons');

async function getSingleProductFamily(productFamilyId) {
  const cloudProductFamilies = await getCloudProductFamilies();

  return cloudProductFamilies.find(
    productFamily => productFamily.id === productFamilyId
  );
}

function getDocsInRelease(listOfDocs, release) {
  return listOfDocs.filter(doc => doc.metadata.release.includes(release));
}

router.get('/:productFamilyId', async function(req, res, next) {
  try {
    const { productFamilyId } = req.params;
    const productFamily = await getSingleProductFamily(productFamilyId);

    const availableReleases = getUniqueInMetadataArrays(
      productFamily.docs,
      'release'
    );

    const sortedReleases = getSortedVersions(availableReleases);

    const highestRelease = sortedReleases[0];

    res.redirect(`${req.params.productFamilyId}/${highestRelease}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:productFamilyId/:release', async function(req, res, next) {
  try {
    const { productFamilyId, release } = req.params;
    const productFamily = await getSingleProductFamily(productFamilyId);
    const availableReleases = getUniqueInMetadataArrays(
      productFamily.docs,
      'release'
    );

    const sortedReleases = getSortedVersions(availableReleases);

    const docsInRelease = getDocsInRelease(productFamily.docs, release);

    let availableCategories = getUniqueInMetadataArrays(
      docsInRelease,
      'category'
    );

    let productLinks = [];
    for (const category of availableCategories) {
      const docsInCategory = docsInRelease.filter(d =>
        d.metadata.category.includes(category)
      );

      const productsInCategory = getUniqueInMetadataArrays(
        docsInCategory,
        'product'
      );

      let linksInProduct = [];
      for (const product of productsInCategory) {
        const docsInProduct = docsInRelease.filter(d =>
          d.metadata.product.includes(product)
        );

        if (docsInProduct.length === 1) {
          linksInProduct.push({
            title: product,
            url: `${docsInProduct[0].url}`,
          });
        }

        if (docsInProduct.length > 1) {
          linksInProduct.push({
            title: product,
            url: `products/${productFamilyId}/${release}/${product}`,
          });
        }
      }

      if (linksInProduct.length > 0) {
        productLinks.push({
          category: category,
          docs: linksInProduct,
        });
      }
    }

    res.render('grouped-cards', {
      title: `${productFamily.name} ${release}`,
      docGroups: productLinks,
      breadcrumb: [{ href: `/`, label: 'Cloud documentation' }],
      selectedRelease: release,
      availableReleases: sortedReleases,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:productFamilyId/:release/:product', async function(
  req,
  res,
  next
) {
  try {
    const { productFamilyId, release, product } = req.params;
    const productFamily = await getSingleProductFamily(productFamilyId);
    const docsInProduct = productFamily.docs.filter(
      d =>
        d.metadata.release.includes(release) &&
        d.metadata.product.includes(product)
    );

    const availableVersions = getUniqueInMetadataFields(
      docsInProduct,
      'version'
    );

    const highestVersion = getSortedVersions(availableVersions)[0];

    res.redirect(`${product}/${highestVersion}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:productFamilyId/:release/:product/:version', async function(
  req,
  res,
  next
) {
  try {
    const { productFamilyId, release, product, version } = req.params;
    const productFamily = await getSingleProductFamily(productFamilyId);
    const docsInProduct = productFamily.docs.filter(
      d =>
        d.metadata.release.includes(release) &&
        d.metadata.product.includes(product) &&
        d.displayOnLandingPages != false
    );
    const availableVersions = getUniqueInMetadataFields(
      docsInProduct,
      'version'
    );

    const sortedVersions = getSortedVersions(availableVersions);

    const docsInVersion = docsInProduct.filter(
      d => d.metadata.version === version
    );

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
        title: `${product} ${version}`,
        docGroups: docsBySubject,
        breadcrumb: [
          { href: `/`, label: 'Cloud documentation' },
          { href: `/products/${productFamilyId}`, label: productFamily.name },
          { href: `/products/${productFamilyId}/${release}`, label: release },
        ],
        selectedRelease: version,
        sortedVersions: sortedVersions,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
