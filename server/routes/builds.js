const express = require('express');
const router = express.Router();
const {
  getAllBuilds,
  getBuildById,
  addOrUpdateBuild,
  deleteBuild,
} = require('../controllers/buildsController');

router.get('/', async function(req, res) {
  const result = await getAllBuilds();
  res.status(result.status).send(result.body);
});

router.get('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const result = await getBuildById(buildId);
  res.status(result.status).send(result.body);
});

router.put('/', async function(req, res) {
  const requestBody = req.body;
  const result = await addOrUpdateBuild(requestBody);
  res.status(result.status).send(result.body);
});

router.delete('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  const result = await deleteBuild(buildId);
  res.status(result.status).send(result.body);
});

module.exports = router;
