const express = require('express');
const router = express.Router();
const {
  getSelfManagedDocumentationPageInfo,
  getProductPageInfo,
} = require('../controllers/selfManagedProductsController');

router.get('/', async function(req, res, next) {
  try {
    const selfManagedDocumentationPageInfo = await getSelfManagedDocumentationPageInfo();
    const { userContext } = req;
    res.render('self-managed-home', {
      userContext: userContext,
      pageInfo: selfManagedDocumentationPageInfo,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:productId/:productVersion', async function(req, res, next) {
  try {
    const { productId, productVersion } = req.params;
    const productPageInfo = await getProductPageInfo(productId, productVersion);
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
});

module.exports = router;
