import { Router } from 'express';
import {
  getAllEntities,
  getBreadcrumbs,
  getDocIdByUrl,
  getDocumentMetadataById,
  getEntity,
  getRootBreadcrumb,
  getVersionSelector,
  splitLegacyValueByComma,
} from '../controllers/configController';
import { winstonLogger } from '../controllers/loggerController';

const router = Router();

router.get('/breadcrumbs', async function (req, res, next) {
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

router.get('/versionSelectors', async function (req, res) {
  const { status, body } = await getVersionSelector(req, res);
  return res.status(status).json(body);
});

// TODO: For editors, we should create separate endpoints in the admin route. They will load entities with all relations
//  or some other way. These endpoints are used by frontend mostly, so we need make requests cheap.
router.get('/entity/:repo', async function (req, res) {
  const { status, body } = await getEntity(req, res);
  return res.status(status).json(body);
});

//FIXME: For entities with a one-word name, a request in a browser is not case-sensitive
//  For entities with a name that has two or more words, a request in a browser is case-sensitive
router.get('/entity/:repo/all', async function (req, res) {
  const { status, body } = await getAllEntities(req, res);
  return res.status(status).json(body);
});

router.get('/entity/doc/metadata', async function (req, res) {
  const { id } = req.query;
  const { status, body } = await getDocumentMetadataById(id as string, res);
  return res.status(status).json(body);
});

router.get('/docMetadata/:docId', async function (req, res) {
  const id = req.params.docId;
  const { status, body } = await getDocumentMetadataById(id, res);

  const mappedConfig = {
    docTitle: body.docTitle,
    docInternal: body.docInternal,
    docEarlyAccess: body.docEarlyAccess,
    platform: splitLegacyValueByComma(body.docPlatforms),
    product: splitLegacyValueByComma(body.docProducts),
    version: splitLegacyValueByComma(body.docVersions),
    release: splitLegacyValueByComma(body.docReleases),
    locale: splitLegacyValueByComma(body.docLocales),
  };

  return res.status(status).json(mappedConfig);
});

router.get('/entity/doc/id', async function (req, res) {
  const { status, body } = await getDocIdByUrl(req, res);
  return res.status(status).json(body);
});

router.get('/entity/page/breadcrumbs', async function (req, res) {
  const { status, body } = await getBreadcrumbs(req, res);
  return res.status(status).json(body);
});

module.exports = router;
