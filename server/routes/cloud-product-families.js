const express = require('express');
const router = express.Router();
const getCloudProductFamilies = require('../controllers/cloudProductFamilyController');

router.get('/:productFamilyId', async function(req, res, next) {
  try {
    const cloudProductFamilies = await getCloudProductFamilies();

    let productFamilyToDisplay = cloudProductFamilies.find(
      productFamily => productFamily.id === req.params.productFamilyId
    );

    const productDocs = productFamilyToDisplay.docs.reduce((r, doc) => {
      if (
        doc.metadata.platform.includes('Cloud') &&
        doc.metadata.productFamily &&
        doc.metadata.productFamily.includes(productFamilyToDisplay.name) &&
        (doc.visible === undefined || doc.visible)
      ) {
        r[doc.metadata.category] = [...(r[doc.metadata.category] || []), doc];
      }
      return r;
    }, {});

    res.render('product-family', {
      productFamily: productFamilyToDisplay,
      docs: productDocs,
      returnUrl: '/',
      returnLabel: 'Back to Cloud product documentation',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
