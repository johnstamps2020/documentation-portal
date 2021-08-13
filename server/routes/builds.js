const express = require('express');
const router = express.Router();
const { getBuilds } = require('../controllers/buildsController');

router.get('/', async function(req, res) {
  const allBuilds = await getBuilds();
  res.send(allBuilds);
});

router.get('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  res.send(`I will get info about build with ID ${buildId}`);
});

module.exports = router;
