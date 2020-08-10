const express = require('express');
const router = express.Router();
const getCloudProducts = require('../controllers/cloudProductController');

router.get('/:productFamilyId', async function(req, res, next) {
  try {
    const cloudProductFamilies = await getCloudProducts();

    let productFamilyToDisplay = cloudProductFamilies.find(
      productFamily => productFamily.id === req.params.productFamilyId
    );
    console.log(productFamilyToDisplay);

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

    res.render('product', {
      product: productFamilyToDisplay,
      docs: productDocs,
      returnUrl: '/',
      returnLabel: 'Back to Cloud product documentation',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
