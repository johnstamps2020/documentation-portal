const express = require('express');
const router = express.Router();
const {
  getHighestCloudRelease,
  getCloudDocumentationPageInfo,
  getProductFamilyPageInfo,
  getProductPageInfo,
} = require('../controllers/cloudDocumentationController');

router.get('/', async (req, res, next) => {
  try {
    const highestCloudRelease = await getHighestCloudRelease();
    if (req.originalUrl === '/') {
      res.redirect(`/${highestCloudRelease}`);
    }
  } catch (err) {
    next(err);
  }
});

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
      release,
      productFamilyId
    );
    res.render('grouped-cards', {
      title: productFamilyPageInfo.title,
      categories: productFamilyPageInfo.categories,
      breadcrumb: [{ href: `/${release}`, label: 'Cloud documentation' }],
      selectedRelease: release,
      availableReleases: productFamilyPageInfo.availableReleases,
    });
  } catch (err) {
    next(err);
  }
});

// router.get('/:release/:productFamilyId/:productId', async function(
//   req,
//   res,
//   next
// ) {
//   try {
//     const { release, productFamilyId } = req.params;
//     res.redirect(`/${release}/${productFamilyId}`);
//   } catch (err) {
//     next(err);
//   }
// });

router.get(
  '/:release/:productFamilyId/:productId/:productVersion',
  async function(req, res, next) {
    try {
      const {
        release,
        productFamilyId,
        productId,
        productVersion,
      } = req.params;
      const productPageInfo = await getProductPageInfo(
        release,
        productFamilyId,
        productId,
        productVersion
      );
      const docsBySubject = productPageInfo.docsBySubject;
      if (docsBySubject.length === 1 && docsBySubject[0].docs.length === 1) {
        res.redirect('/' + docsBySubject[0].docs[0].url);
      } else {
        res.render('grouped-links', {
          title: productPageInfo.title,
          docsBySubject: productPageInfo.docsBySubject,
          breadcrumb: productPageInfo.breadcrumb,
          selectedRelease: productVersion,
          sortedVersions: productPageInfo.sortedVersions,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
