import { Request, Response, Router } from 'express';
import {
  createOrUpdateEntity,
  createOrUpdateMultipleEntities,
  deleteEntities,
  deleteEntity,
} from '../controllers/configController';
import {
  deleteObsoleteEntitiesFromDb,
  getLegacyConfigs,
  putConfigsInDatabase,
} from '../controllers/legacyConfigController';
import { ApiResponse } from '../types/apiResponse';

const router = Router();

async function runRequest(
  req: Request,
  res: Response,
  handlerFunction: (req: Request) => Promise<ApiResponse>
) {
  const { status, body } = await handlerFunction(req);
  return res.status(status).json(body);
}

router.post('/entity/:repo', async function (req, res) {
  return runRequest(req, res, createOrUpdateEntity);
});

router.put('/entity/:repo', async function (req, res) {
  return runRequest(req, res, createOrUpdateEntity);
});

router.delete('/entity/:repo', async function (req, res) {
  return runRequest(req, res, deleteEntity);
});

router.post('/entities/:repo', async function (req, res) {
  return runRequest(req, res, createOrUpdateMultipleEntities);
});

router.put('/entities/:repo', async function (req, res) {
  return runRequest(req, res, createOrUpdateMultipleEntities);
});

router.delete('/entities/:repo', async function (req, res) {
  return runRequest(req, res, deleteEntities);
});

router.get('/entities/clean', async function (req, res) {
  return runRequest(req, res, deleteObsoleteEntitiesFromDb);
});

router.get('/entity/legacy/:configType', async function (req, res) {
  return runRequest(req, res, getLegacyConfigs);
});
router.put('/entity/legacy/:configType', async function (req, res) {
  return runRequest(req, res, putConfigsInDatabase);
});

module.exports = router;
