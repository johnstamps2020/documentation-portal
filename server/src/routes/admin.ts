import { Router } from 'express';
import {
  getLegacyBuildConfigs,
  getLegacyDocConfigs,
  getLegacySourceConfigs,
  putDocConfigsInDatabase,
  putOpenRoutesConfigsInDatabase,
  putPageConfigsInDatabase,
  putSourceConfigsInDatabase,
} from '../controllers/legacyConfigController';
import {
  createOrUpdateEntity,
  deleteEntity,
} from '../controllers/configController';
import { ApiResponse } from '../types/apiResponse';

const router = Router();

router.post('/entity/:repo', async function (req, res) {
  const { repo } = req.params;
  const options = req.body;
  const { status, body } = await createOrUpdateEntity(repo, options, res);
  return res.status(status).json(body);
});

router.put('/entity/:repo', async function (req, res) {
  const { repo } = req.params;
  const options = req.body;
  const { status, body } = await createOrUpdateEntity(repo, options, res);
  return res.status(status).json(body);
});

router.delete('/entity/:repo', async function (req, res) {
  const { repo } = req.params;
  const options = req.body;
  const { status, body } = await deleteEntity(repo, options, res);
  return res.status(status).json(body);
});

router.get('/entity/legacy/:configType', async function (req, res) {
  const { configType } = req.params;
  let response: ApiResponse = {
    status: 400,
    body: {
      message:
        'Incorrect configType parameter. Use "doc", "source", "build". For example: /entity/legacy/doc',
    },
  };
  if (configType === 'source') {
    response = await getLegacySourceConfigs(res);
  } else if (configType === 'doc') {
    response = await getLegacyDocConfigs(res);
  } else if (configType === 'build') {
    response = await getLegacyBuildConfigs(res);
  }
  return res.status(response.status).json(response.body);
});
router.put('/entity/legacy/:configType', async function (req, res) {
  const { configType } = req.params;
  let response: ApiResponse = {
    status: 400,
    body: {
      message:
        'Incorrect configType parameter. Use "doc", "source", "page", "openRoutes. For example: /entity/legacy/putConfigInDatabase/doc',
    },
  };
  if (configType === 'doc') {
    response = await putDocConfigsInDatabase(res);
  } else if (configType === 'source') {
    response = await putSourceConfigsInDatabase(res);
  } else if (configType === 'page') {
    response = await putPageConfigsInDatabase(res);
  } else if (configType === 'openRoute') {
    response = await putOpenRoutesConfigsInDatabase(res);
  }
  return res.status(response.status).json(response.body);
});

module.exports = router;
