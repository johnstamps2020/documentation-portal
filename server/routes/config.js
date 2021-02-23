const express = require('express');
const router = express.Router();
const {
  getConfig,
  getTaxonomy,
  getVersionsForProductOnPlatform,
} = require('../controllers/configController');

router.get('/', async function(req, res) {
  const config = await getConfig();
  res.send(config);
});

router.get('/taxonomy/:release', async function(req, res) {
  const config = await getTaxonomy(req.params.release);
  res.send(config);
});

router.get('/versions/:product/:platform', async function(req, res) {
  const { product, platform } = req.params;
  const versions = await getVersionsForProductOnPlatform(
    product,
    platform,
    req.isAuthenticated()
  );
  res.send(versions);
});

module.exports = router;
