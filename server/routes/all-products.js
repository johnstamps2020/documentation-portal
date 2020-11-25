const express = require('express');
const router = express.Router();
const {
  findProductRoute,
} = require('../controllers/allProductsController');

router.get('/:productId', async function(req, res, next) {
  try {
    const { productId } = req.params;
    const productRoute = await findProductRoute(productId);
    if (productRoute) {
      res.redirect(productRoute);
    } else {
      res.redirect('/404');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:productId/:productVersion', async function(req, res, next) {
  try {
    const { productId, productVersion } = req.params;
    const productRoute = await findProductRoute(productId, productVersion);
    if (productRoute) {
      res.redirect(productRoute);
    } else {
      res.redirect('/404');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
