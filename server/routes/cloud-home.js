const express = require('express');
const router = express.Router();
const getConfig = require('../controllers/configController');
const getCloudDocumentationPageInfo = require('../controllers/cloudDocumentationController')
  .getCloudDocumentationPageInfo;
const {
  getUniqueInMetadataArrays,
  getSortedVersions,
} = require('../routes/helpers/metadata');

const cloudHome = async (req, res, next) => {
  try {
    const serverConfig = await getConfig();
    const docs = serverConfig.docs.filter(
      doc =>
        doc.metadata.platform.includes('Cloud') &&
        doc.displayOnLandingPages !== false
    );
    const highestCloudRelease = getSortedVersions(
      getUniqueInMetadataArrays(docs, 'release')
    )[0];
    const cloudDocumentationPageInfo = await getCloudDocumentationPageInfo(
      highestCloudRelease
    );
    if (req.originalUrl === '/') {
      res.render('cloud-home', {
        title: cloudDocumentationPageInfo.title,
        productFamilies: cloudDocumentationPageInfo.productFamilies,
        selectedRelease: highestCloudRelease,
        availableReleases: cloudDocumentationPageInfo.availableReleases,
      });
    } else {
      router.get('/:release', async function(req, res, next) {
        try {
          const release = req.params;
          const cloudDocumentationPageInfo = await getCloudDocumentationPageInfo(
            release
          );
          res.render('cloud-home', {
            title: cloudDocumentationPageInfo.title,
            productFamilies: cloudDocumentationPageInfo.productFamilies,
            selectedRelease: release,
            availableReleases: cloudDocumentationPageInfo.availableReleases,
          });
        } catch (err) {
          next(err);
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = cloudHome;
