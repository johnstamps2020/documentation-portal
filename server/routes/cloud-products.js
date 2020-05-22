const express = require('express');
const router = express.Router();
const config = require('../config.json');
const cloudProductFamilies = require('../controllers/cloudProductController');

const configureRouter = async () => {
  console.log('Generating category pages');
  console.log(cloudProductFamilies);

  cloudProductFamilies.forEach(productFamily => {
    router.get(`/${productFamily.href}`, (req, res) => {
      const productDocs = config.docs
        .map(doc => {
          if (
            doc.metadata.productFamily &&
            doc.metadata.productFamily.includes(productFamily.name)
          ) {
            if (doc.visible === undefined || doc.visible) {
              return doc;
            }
          }
        })
        .filter(Boolean);
      res.render('product', { product: productFamily, docs: productDocs });
    });
  });
};

configureRouter();

module.exports = router;
