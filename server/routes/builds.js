const express = require('express');
const router = express.Router();
const {
  getBuilds,
  addOrUpdateBuild,
  deleteBuild,
} = require('../controllers/buildsController');

router.get('/', async function(req, res) {
  const result = await getBuilds();
  res.send(result);
});

router.get('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const result = await getBuilds(buildId);
  res.send(result);
});

router.put('/', async function(req, res) {
  const requestBody = req.body;
  const result = await addOrUpdateBuild(requestBody);
  res.send(result);
});

router.delete('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const result = await deleteBuild(buildId);
  res.send(result);
});

module.exports = router;
