const express = require('express');
const router = express.Router();
const {
  getConfig,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
  getDocId,
} = require('../controllers/configController');
const ejs = require('ejs');
const fs = require('fs');

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

router.get('/versionSelectors/component', async function(req, res) {
  const { docId } = req.query;
  const selectorObject = await getVersionSelector(docId, req);
  const allVersions = selectorObject.matchingVersionSelector?.allVersions;
  if (!allVersions || allVersions.length === 0) {
    res.send(undefined);
  } else {
    const versionSelectorTemplate = fs.readFileSync(
      `${__dirname}/../views/parts/version-selector.ejs`,
      { encoding: 'utf-8' }
    );
    const versionSelectorComponent = ejs.render(versionSelectorTemplate, {
      allVersions: allVersions,
    });
    res.send(versionSelectorComponent);
  }
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
