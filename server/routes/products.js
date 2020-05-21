const express = require('express');
const router = express.Router();
const config = require('../config.json');
const cloudProductList = require('../controllers/cloudProductController');

const configureRouter = async () => {
  console.log('Generating category pages');

  cloudProductList.forEach(product => {
    router.get(`/${product.href}`, (req, res) => {
      const productDocs = config.docs
        .map(doc => {
          console.log(doc);
          if (doc.metadata.product.includes(product.name)) {
            if (doc.visible === undefined || doc.visible) {
              return doc;
            }
          }
        })
        .filter(Boolean);
      res.render('product', { product: product, docs: productDocs });
    });
  });
};

configureRouter();

module.exports = router;
