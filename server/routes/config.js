const express = require('express');
const router = express.Router();
const { getConfig, getTaxonomy } = require('../controllers/configController');

router.get('/', async function(req, res) {
  const config = await getConfig();
  res.send(config);
});

router.get('/taxonomy/:release', async function(req, res) {
  const config = await getTaxonomy(req.params.release);
  res.send(config);
});

module.exports = router;
