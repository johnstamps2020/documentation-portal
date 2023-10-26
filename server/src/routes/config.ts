import { Router } from 'express';
import {
  getAllEntities,
  getBreadcrumbs,
  getDocIdByUrl,
  getDocumentMetadataById,
  getDocUrlByMetadata,
  getEntity,
  getPageItems,
  getRootBreadcrumb,
  getVersionSelector,
  splitLegacyValueByCommaAndReturnUnique,
} from '../controllers/configController';

const router = Router();

router.get('/breadcrumbs', async function (req, res, next) {
  const { pagePathname } = req.query;
  const { status, body } = await getRootBreadcrumb(pagePathname as string, res);
  return res.status(status).json(body);
});

router.get('/versionSelectors', async function (req, res) {
  const { status, body } = await getVersionSelector(req, res);
  return res.status(status).json(body);
});

router.post('/pageItems', async function (req, res) {
  const { status, body } = await getPageItems(req, res);
  return res.status(status).json(body);
});

// TODO: For editors, we should create separate endpoints in the admin route. They will load entities with all relations
//  or some other way. These endpoints are used by frontend mostly, so we need make requests cheap.
router.get('/entity/:repo', async function (req, res) {
  const { status, body } = await getEntity(req, res);
  return res.status(status).json(body);
});

router.get('/entity/:repo/relations', async function (req, res) {
  const { status, body } = await getEntity(req, res, true);
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

router.get('/docUrl', async function (req, res) {
  const { products, versions, title, language } = req.query;
  const { status, body } = await getDocUrlByMetadata(
    products as string,
    versions as string,
    title as string,
    language as string,
    res
  );
  return res.status(status).json(body);
});

router.get('/docMetadata/:docId', async function (req, res) {
  const id = req.params.docId;
  const { status, body } = await getDocumentMetadataById(id, res);

  const mappedConfig = {
    docTitle: body.docTitle,
    docDisplayTitle: body.docDisplayTitle,
    docInternal: body.docInternal,
    docEarlyAccess: body.docEarlyAccess,
    platform: splitLegacyValueByCommaAndReturnUnique(body.docPlatforms),
    product: splitLegacyValueByCommaAndReturnUnique(body.docProducts),
    version: splitLegacyValueByCommaAndReturnUnique(body.docVersions),
    release: splitLegacyValueByCommaAndReturnUnique(body.docReleases),
    language: body.docLanguage,
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
