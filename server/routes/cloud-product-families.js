const express = require('express');
const router = express.Router();
const {
  getCloudDocumentationPageInfo,
  getProductFamilyPageInfo,
} = require('../controllers/cloudDocumentationController');

router.get('/:release', async function(req, res, next) {
  try {
    const release = req.params.release;
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

router.get('/:release/:productFamilyId', async function(req, res, next) {
  try {
    const { release, productFamilyId } = req.params;
    const productFamilyPageInfo = await getProductFamilyPageInfo(
      productFamilyId
    );
    res.render('grouped-cards', {
      title: productFamilyPageInfo.title,
      categories: productFamilyPageInfo.categories,
      breadcrumb: [{ href: `/`, label: 'Cloud documentation' }],
      selectedRelease: release,
      availableReleases: productFamilyPageInfo.availableReleases,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
