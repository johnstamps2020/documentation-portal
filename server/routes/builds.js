const express = require('express');
const router = express.Router();
const {
  getAllBuilds,
  getBuildById,
  getBuildsByResources,
  addOrUpdateBuild,
  deleteBuild,
} = require('../controllers/buildsController');

router.get('/', async function(req, res) {
  const result = await getAllBuilds();
  res.status(result.status).send(result.body);
});

router.put('/', async function(req, res) {
  const requestBody = req.body;
  const result = await addOrUpdateBuild(requestBody);
  res.status(result.status).send(result.body);
});

router.get('/ids/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const result = await getBuildById(buildId);
  res.status(result.status).send(result.body);
});

router.delete('/ids/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const result = await deleteBuild(buildId);
  res.status(result.status).send(result.body);
});

router.get('/resources', async function(req, res) {
  const { gitUrl, gitBranch, resources } = req.body;
  const result = await getBuildsByResources(gitUrl, gitBranch, resources);
  res.status(result.status).send(result.body);
});

module.exports = router;
