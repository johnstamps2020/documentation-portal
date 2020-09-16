const express = require('express');
const { doc } = require('prettier');
const router = express.Router();
const getCloudProductFamilies = require('../controllers/cloudProductFamilyController');

async function getSingleProductFamily(productFamilyId) {
  const cloudProductFamilies = await getCloudProductFamilies();

  return cloudProductFamilies.find(
    productFamily => productFamily.id === productFamilyId
  );
}

function getDocsInRelease(listOfDocs, release) {
  return listOfDocs.filter(doc => doc.metadata.release.includes(release));
}

function getHighestRelease(listOfReleases) {
  const releasesFromNewest = ['Banff', 'Aspen'];

  for (const releaseName of releasesFromNewest) {
    if (listOfReleases.includes(releaseName)) {
      return releaseName;
    }
  }
}

function getUniqueInMetadataArrays(listOfDocs, fieldName) {
  let availableValues = [];
  for (const doc of listOfDocs) {
    const values = doc.metadata[fieldName];
    if (values) {
      for (const value of values) {
        if (!availableValues.includes(value)) {
          availableValues.push(value);
        }
      }
    }
  }

  return availableValues;
}

function getUniqueInMetadataFields(listOfDocs, fieldName) {
  let availableValues = [];
  for (const doc of listOfDocs) {
    const value = doc.metadata[fieldName];
    if (value && !availableValues.includes(value)) {
      availableValues.push(value);
    }
  }

  return availableValues;
}

function getHighestVersion(listOfVersions) {
  if (listOfVersions.includes('latest')) {
    return 'latest';
  }

  const versionNumbers = listOfVersions.map(v => parseFloat(v));
  const highestVersionNumber = Math.max(...versionNumbers);
  const highestVersion = listOfVersions.find(
    p => parseFloat(p) === highestVersionNumber
  );

  return highestVersion;
}

router.get('/:productFamilyId', async function(req, res, next) {
  try {
    const { productFamilyId } = req.params;
    const productFamily = await getSingleProductFamily(productFamilyId);

    const availableReleases = getUniqueInMetadataArrays(
      productFamily.docs,
      'release'
    );

    const highestRelease = getHighestRelease(availableReleases);

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
            url: `/${docsInProduct[0].url}`,
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

    res.render('grouped-links', {
      title: `${productFamily.name} ${release}`,
      docGroups: productLinks,
      returnUrl: '/',
      returnLabel: 'Back to Cloud product documentation',
      selectedRelease: release,
      availableReleases: availableReleases,
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

    const highestVersion = getHighestVersion(availableVersions);

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
        d.metadata.product.includes(product)
    );
    const availableVersions = getUniqueInMetadataFields(
      docsInProduct,
      'version'
    );

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
        });
      }
    }

    const docsWithoutSubject = docsInVersion.filter(d => !d.metadata.subject);

    docsBySubject.push({
      category: '',
      docs: docsWithoutSubject,
    });

    res.render('grouped-links', {
      title: `${product} ${version}`,
      docGroups: docsBySubject,
      returnUrl: `/products/${productFamilyId}/${release}`,
      returnLabel: `Back to the ${release} release`,
      selectedRelease: version,
      availableReleases: availableVersions,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
