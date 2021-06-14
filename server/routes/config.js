const express = require('express');
const router = express.Router();
const {
  getConfig,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
} = require('../controllers/configController');

router.get('/', async function(req, res) {
  const config = await getConfig();
  res.send(config);
});

router.get('/breadcrumbs', async function(req, res) {
  const { pagePathname } = req.query;
  const rootBreadcrumb = await getRootBreadcrumb(pagePathname);
  res.send(rootBreadcrumb);
});

router.get('/versionSelectors', async function(req, res) {
  const { platform, product, version } = req.query;
  const otherVersions = await getVersionSelector(platform, product, version);
  res.send(otherVersions);
});

router.get('/docMetadata/:docId', async function(req, res) {
  const { docId } = req.params;
  const docMetadata = await getDocumentMetadata(docId);
  res.send(docMetadata);
});

module.exports = router;
