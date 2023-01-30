import { Router } from 'express';
import {
  createOrUpdateEntity,
  deleteEntity,
  getAllEntities,
  getBreadcrumbs,
  getDocIdByUrl,
  getDocumentMetadataById,
  getEntity,
  getEnv,
  getPageData,
  getRootBreadcrumb,
  getVersionSelector,
} from '../controllers/configController';
import { winstonLogger } from '../controllers/loggerController';
import { Doc } from '../model/entity/Doc';
import {
  getLegacyBuildConfigs,
  getLegacyDocConfigs,
  getLegacySourceConfigs,
  putDocConfigsInDatabase,
  putOpenRoutesConfigsInDatabase,
  putPageConfigsInDatabase,
  putSourceConfigsInDatabase,
} from '../controllers/legacyConfigController';

const router = Router();

router.get('/', async function(req, res) {
  const { status, body } = await getAllEntities(Doc.name);
  res.status(status).json(body);
});

router.get('/breadcrumbs', async function(req, res, next) {
  try {
    const pagePathname = req.query.pagePathname as string;
    if (!pagePathname) {
      return res
        .status(500)
        .send('Provide a pagePathname query parameter to get a breadcrumb');
    }

    const rootBreadcrumb = await getRootBreadcrumb(pagePathname.toString());
    return res.send(rootBreadcrumb);
  } catch (err) {
    winstonLogger.error(
      `[SAFE CONFIG] Problem sending breadcrumbs: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

router.get('/versionSelectors', async function(req, res, next) {
  try {
    const docId = req.query.docId;
    if (!docId) {
      return res
        .status(500)
        .send('Provide a docID query parameter to get a version selector');
    }

    const allVersions = await getVersionSelector(docId as string, req, res);
    return res.send(allVersions);
  } catch (err) {
    winstonLogger.error(`[SAFE CONFIG] Problem sending version selectors
      ERROR: ${JSON.stringify(err)}
      REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

router.get('/env', function(req, res) {
  const env = getEnv();
  res.send(env);
});

router.get('/entity/:repo', async function(req, res) {
  const { status, body } = await getEntity(req);
  return res.status(status).json(body);
});

router.get('/entity/:repo/all', async function(req, res) {
  const { repo } = req.params;
  const { status, body } = await getAllEntities(repo);
  return res.status(status).json(body);
});

router.post('/entity/:repo', async function(req, res) {
  const { repo } = req.params;
  const options = req.body;
  const { status, body } = await createOrUpdateEntity(repo, options);
  return res.status(status).json(body);
});

router.put('/entity/:repo', async function(req, res) {
  const { repo } = req.params;
  const options = req.body;
  const { status, body } = await createOrUpdateEntity(repo, options);
  return res.status(status).json(body);
});

router.delete('/entity/:repo', async function(req, res) {
  const { repo } = req.params;
  const options = req.body;
  const { status, body } = await deleteEntity(repo, options);
  return res.status(status).json(body);
});

router.get('/entity/doc/metadata', async function(req, res) {
  const { id } = req.query;
  const { status, body } = await getDocumentMetadataById(id as string);
  return res.status(status).json(body);
});

router.get('/entity/doc/id', async function(req, res) {
  const { url } = req.query;
  const { status, body } = await getDocIdByUrl(url as string);
  return res.status(status).json(body);
});

router.get('/entity/page/breadcrumbs', async function(req, res) {
  const { path } = req.query;
  const { status, body } = await getBreadcrumbs(path as string);
  return res.status(status).json(body);
});

router.get('/entity/page/data', async function(req, res) {
  const { status, body } = await getPageData(req);
  return res.status(status).json(body);
});

router.get('/entity/legacy/docs', async function(req, res) {
  const { status, body } = await getLegacyDocConfigs();
  return res.status(status).json(body);
});

router.get('/entity/legacy/builds', async function(req, res) {
  const { status, body } = await getLegacyBuildConfigs();
  return res.status(status).json(body);
});

router.get('/entity/legacy/sources', async function(req, res) {
  const { status, body } = await getLegacySourceConfigs();
  return res.status(status).json(body);
});

router.get('/entity/legacy/putConfigInDatabase/:configType', async function(
  req,
  res
) {
  const { configType } = req.params;
  let status;
  let body;
  if (configType === 'doc') {
    const response = await putDocConfigsInDatabase();
    status = response.status;
    body = response.body;
  } else if (configType === 'source') {
    const response = await putSourceConfigsInDatabase();
    status = response.status;
    body = response.body;
  } else if (configType === 'page') {
    const response = await putPageConfigsInDatabase();
    status = response.status;
    body = response.body;
  } else if (configType === 'openRoutes') {
    const response = await putOpenRoutesConfigsInDatabase();
    status = response.status;
    body = response.body;
  } else {
    status = 400;
    body = {
      message:
        'Incorrect configType parameter. Use "doc", "source", "page", "openRoutes. For example: /entity/legacy/putConfigInDatabase/doc',
    };
  }
  return res.status(status).json(body);
});

module.exports = router;
