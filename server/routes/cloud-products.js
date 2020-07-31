const express = require('express');
const router = express.Router();
const getCloudProducts = require('../controllers/cloudProductController');

const configureRouter = async () => {
  const cloudProductFamilies = await getCloudProducts();
  cloudProductFamilies.forEach(productFamily => {
    const productDocs = productFamily.docs.reduce((r, doc) => {
      if (
        doc.metadata.platform.includes('Cloud') &&
        doc.metadata.productFamily &&
        doc.metadata.productFamily.includes(productFamily.name) &&
        (doc.visible === undefined || doc.visible)
      ) {
        r[doc.metadata.category] = [...(r[doc.metadata.category] || []), doc];
      }
      return r;
    }, {});

    router.get(`/${productFamily.id}`, (req, res) => {
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
