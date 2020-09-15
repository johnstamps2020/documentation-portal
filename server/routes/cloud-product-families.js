const express = require('express');
const router = express.Router();
const getCloudProductFamilies = require('../controllers/cloudProductFamilyController');

async function getSingleProductFamily(productFamilyId) {
  const cloudProductFamilies = await getCloudProductFamilies();

  return cloudProductFamilies.find(
    productFamily => productFamily.id === productFamilyId
  );
}

function getDocsInVersion(listOfDocs, version) {
  return listOfDocs.filter(doc => doc.metadata.version === version);
}

function getHighestVersion(listOfVersions) {
  if (listOfVersions.includes('latest')) {
    return 'latest';
  }

  const versionNumbers = listOfVersions.map(v => parseFloat(v));
  const highestVersionNumber = Math.max(...versionNumbers);
  const latestVersion = listOfVersions.find(
    p => parseFloat(p) === highestVersionNumber
  );

  return latestVersion;
}

function getAvailableVersions(listOfDocs) {
  let availableVersions = [];
  for (const doc of listOfDocs) {
    const version = doc.metadata.version;
    if (!availableVersions.includes(version)) {
      availableVersions.push(version);
    }
  }

  return availableVersions;
}

router.get('/:productFamilyId', async function(req, res, next) {
  try {
    const productFamilyToDisplay = await getSingleProductFamily(
      req.params.productFamilyId
    );

    const availableVersions = getAvailableVersions(productFamilyToDisplay.docs);

    const highestVersion = getHighestVersion(availableVersions);

    res.redirect(`${req.params.productFamilyId}/${highestVersion}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:productFamilyId/:version', async function(req, res, next) {
  try {
    const productFamilyToDisplay = await getSingleProductFamily(
      req.params.productFamilyId
    );
    const availableVersions = getAvailableVersions(productFamilyToDisplay.docs);
    const version = req.params.version;

    const docsInVersion = getDocsInVersion(
      productFamilyToDisplay.docs,
      version
    );

    let availableCategories = [];
    for (const doc of docsInVersion) {
      for (const category of doc.metadata.category) {
        if (!availableCategories.includes(category)) {
          availableCategories.push(category);
        }
      }
    }

    let docsByCategoryInThisVersion = [];
    for (const category of availableCategories) {
      const docsInCategory = docsInVersion.filter(d =>
        d.metadata.category.includes(category)
      );
      if (docsInCategory.length > 0) {
        docsByCategoryInThisVersion.push({
          category: category,
          docs: docsInCategory,
        });
      }
    }

    res.render('product-family', {
      productFamily: productFamilyToDisplay,
      docGroups: docsByCategoryInThisVersion,
      returnUrl: '/',
      returnLabel: 'Back to Cloud product documentation',
      selectedVersion: version,
      availableVersions: availableVersions,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
