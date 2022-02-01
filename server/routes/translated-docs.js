const express = require('express');
const router = express.Router();
const { getTranslatedPages } = require('../controllers/frontendController');

router.get('/', function(req, res) {
  const translatedPages = getTranslatedPages();
  res.send(translatedPages);
});

module.exports = router;
