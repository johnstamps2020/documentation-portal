const e = require('express');
const express = require('express');
const router = express.Router();
const getProduct = require('../controllers/productController');

router.get('/:productId/:version', async function(req, res, next) {
  try {
    const product = await getProduct(req.params.productId, req.params.version);
    res.render('product', {
      product: product.name,
      version: product.version,
      docs: product.docs,
      returnUrl: `/`,
      returnLabel: `Back to the home page`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
