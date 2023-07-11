const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', async function (req, res, next) {
  if (req.query.getData === 'true' || req.query.rawJSON === 'true') {
    const { status, body } = await searchController(req, res, next);
    return res.status(status).json(body);
  }

  const redirectUrl = '/search-results?' + req.originalUrl.split('?')[1];

  res.redirect(redirectUrl);
});

module.exports = router;
