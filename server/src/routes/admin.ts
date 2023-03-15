import { Router } from 'express';
import {
  getLegacyConfigs,
  putConfigsInDatabase,
} from '../controllers/legacyConfigController';
import {
  createOrUpdateEntity,
  deleteEntity,
} from '../controllers/configController';

const router = Router();

router.post('/entity/:repo', async function (req, res) {
  const { status, body } = await createOrUpdateEntity(req);
  return res.status(status).json(body);
});

router.put('/entity/:repo', async function (req, res) {
  const { status, body } = await createOrUpdateEntity(req);
  return res.status(status).json(body);
});

router.delete('/entity/:repo', async function (req, res) {
  const { status, body } = await deleteEntity(req);
  return res.status(status).json(body);
});

router.get('/entity/legacy/:configType', async function (req, res) {
  const { status, body } = await getLegacyConfigs(req);
  return res.status(status).json(body);
});
router.put('/entity/legacy/:configType', async function (req, res) {
  const { status, body } = await putConfigsInDatabase(req);
  return res.status(status).json(body);
});

module.exports = router;
