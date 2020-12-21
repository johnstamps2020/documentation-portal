const express = require('express');
const router = express.Router();
const {
  getHighestCloudRelease,
  getCloudDocumentationPageInfo,
  getProductFamilyPageInfo,
  getProductPageInfo,
} = require('../controllers/cloudProductsController');

const cloudProductsEndpoint = '/cloudProducts';

router.get('/', async (req, res, next) => {
  try {
    const highestCloudRelease = await getHighestCloudRelease();
    res.redirect(`${cloudProductsEndpoint}/${highestCloudRelease}`);
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
    const { userContext } = req;
    res.render('cloud-home', {
      userContext: userContext,
      pageInfo: cloudDocumentationPageInfo,
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
    const { userContext } = req;
    res.render('grouped-cards', {
      userContext: userContext,
      pageInfo: productFamilyPageInfo,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:release/:productFamilyId/:productId', async function(
  req,
  res,
  next
) {
  try {
    const { release, productFamilyId } = req.params;
    res.redirect(`${cloudProductsEndpoint}/${release}/${productFamilyId}`);
  } catch (err) {
    next(err);
  }
});

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
      const subjects = productPageInfo.subjects;
      if (subjects.length === 1 && subjects[0].subjectDocs.length === 1) {
        res.redirect(subjects[0].subjectDocs[0].url);
      } else {
        const { userContext } = req;
        res.render('grouped-links', {
          userContext: userContext,
          pageInfo: productPageInfo,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
