const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', async function (req, res, next) {
  const { status, body } = await searchController(req, res, next);
  res.status(status).json(body);
});

module.exports = router;
