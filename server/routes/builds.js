const express = require('express');
const router = express.Router();
const { getBuilds, addBuild } = require('../controllers/buildsController');

router.get('/', async function(req, res) {
  const allBuilds = await getBuilds();
  res.send(allBuilds);
});

router.get('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const buildInfo = await getBuilds(buildId);
  res.send(buildInfo);
});

router.post('/', async function(req, res) {
  const requestBody = req.body;
  const newBuild = await addBuild(requestBody);
  res.send(newBuild);
});

router.delete('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  res.send(`I will delete ${buildId}`);
});

module.exports = router;
