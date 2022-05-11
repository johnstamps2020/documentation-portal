const express = require('express');
const router = express.Router();
const {
  getConfig,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
  getDocId,
  expensiveLoadConfig,
} = require('../controllers/configController');
const ejs = require('ejs');
const fs = require('fs');
const { winstonLogger } = require('../controllers/loggerController');

router.get('/', async function(req, res) {
  const config = await getConfig(req, res);
  res.send(config);
});

router.get('/breadcrumbs', async function(req, res) {
  const { pagePathname } = req.query;
  const rootBreadcrumb = await getRootBreadcrumb(pagePathname);
  res.send(rootBreadcrumb);
});

router.get('/versionSelectors', async function(req, res) {
  const { docId } = req.query;
  const allVersions = await getVersionSelector(docId, req, res);
  res.send(allVersions);
});

router.get('/versionSelectors/component', async function(req, res) {
  const { docId } = req.query;
  const selectorObject = await getVersionSelector(docId, req, res);
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
  const docMetadata = await getDocumentMetadata(docId, req, res);
  res.send(docMetadata);
});

router.get('/docId', async function(req, res) {
  const { platforms, products, versions, title, url } = req.query;
  const docId = await getDocId(
    products,
    platforms,
    versions,
    title,
    url,
    req,
    res
  );
  res.send(docId);
});

router.get('/refreshConfig', async function(req, res) {
  try {
    const configExists = await expensiveLoadConfig();
    if (configExists) {
      res.status(200).send({
        message:
          'Config update happened without error, I guess ¯\\_(ツ)_/¯ (we are not sure if it succeeded or not)',
      });
    } else {
      res.status(500).send({ message: 'Config not updated' });
    }
  } catch (err) {
    winstonLogger.error(`Could not update config: ${err.message}`);
  }
});

module.exports = router;
