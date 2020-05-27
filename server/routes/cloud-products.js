const express = require('express');
const router = express.Router();
const config = require('../config.json');
const cloudProductFamilies = require('../controllers/cloudProductController');

const configureRouter = async () => {
  cloudProductFamilies.forEach(productFamily => {
    router.get(`/${productFamily.href}`, (req, res) => {
      const productDocs = config.docs.reduce((r, doc) => {
        if (
          doc.metadata.platform === 'Cloud' &&
          doc.metadata.productFamily &&
          doc.metadata.productFamily.includes(productFamily.name) &&
          (doc.visible === undefined || doc.visible)
        ) {
          r[doc.metadata.category] = [...(r[doc.metadata.category] || []), doc];
        }
        return r;
      }, {});

      res.render('product', {
        product: productFamily,
        docs: productDocs,
        returnUrl: '/',
        returnLabel: 'Back to Cloud product documentation',
      });
    });
  });
};

configureRouter();

module.exports = router;
