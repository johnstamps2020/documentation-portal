const express = require('express');
const router = express.Router();
const categoryMappings = require('../controllers/categoryMappings');
const config = require('../config.json');

const configureRouter = async () => {
  console.log('Generating category pages');

  categoryMappings.forEach(mapping => {
    router.get(mapping.href, (req, res) => {
      const docsInCategory = config.docs
        .map(doc => {
          if (doc.metadata.category.includes(mapping.name)) {
            return doc;
          }
        })
        .filter(Boolean);
      res.render('category', { category: mapping, docs: docsInCategory });
    });
  });
};

configureRouter();

module.exports = router;
