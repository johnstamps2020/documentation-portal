const express = require('express');
const router = express.Router();
const getProductFamilyPageInfo = require('../controllers/cloudDocumentationController')
  .getProductFamilyPageInfo;

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
