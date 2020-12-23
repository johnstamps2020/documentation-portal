const express = require('express');
const router = express.Router();
const { getConfig } = require('../controllers/configController');

router.get('/', async function(req, res) {
  const config = await getConfig();
  res.send(config);
});

module.exports = router;
