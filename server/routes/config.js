const express = require('express');
const router = express.Router();
const {
  getConfig,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
  getDocId,
} = require('../controllers/configController');

router.get('/', async function(req, res) {
  const config = await getConfig(req);
  res.send(config);
});

router.get('/breadcrumbs', async function(req, res) {
  const { pagePathname } = req.query;
  const rootBreadcrumb = await getRootBreadcrumb(pagePathname);
  res.send(rootBreadcrumb);
});

router.get('/versionSelectors', async function(req, res) {
  const { docId } = req.query;
  const allVersions = await getVersionSelector(docId, req);
  res.send(allVersions);
});

router.get('/docMetadata/:docId', async function(req, res) {
  const { docId } = req.params;
  const docMetadata = await getDocumentMetadata(docId, req);
  res.send(docMetadata);
});

router.get('/docId', async function(req, res) {
  const { platforms, products, versions, title, url } = req.query;
  const docId = await getDocId(products, platforms, versions, title, url, req);
  res.send(docId);
});

module.exports = router;
