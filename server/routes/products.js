const e = require('express');
const express = require('express');
const { version } = require('winston');
const router = express.Router();
const getProduct = require('../controllers/productController');

router.get('/:productId/:version', async function(req, res, next) {
  try {
    console.log(
      'PARAMS',
      `productId ${req.params.productId}, version ${req.params.version}`
    );
    const product = await getProduct(req.params.productId, req.params.version);
    res.render('product', {
      product: product.name,
      version: product.version,
      docs: product.docs,
      returnUrl: `/`,
      returnLabel: `Back to the home page`,
    });
    // if (product && product.docs.length > 1) {
    // } else if (product) {
    //   console.log(product);
    //   res.redirect(`/${product.url}`);
    // } else {
    //   res.redirect('/');
    // }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
