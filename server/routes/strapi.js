const express = require('express');
const router = express.Router();
const {
  getPageTitle,
  updatePageTitle,
  getPageInfo,
  importAllFlailToStrapi,
  importFlailPageToStrapi,
  getStrapiDocByDocId,
  getStrapiSourceBySrcId
} = require('../controllers/strapiController');
const ejs = require('ejs');
const { winstonLogger } = require('../controllers/loggerController');

router.get('/page/:relativeUrl', async function(req, res, next) {
  try {
    const pageInfo = await getPageInfo(req.params.relativeUrl);
    res.send(pageInfo);
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem getting page info from ${req.url}: ${err}`
    );
    next(err);
  }
});

router.get('/page/:relativeUrl/title', async function(req, res, next) {
  try {
    const pageTitle = await getPageTitle(req.params.relativeUrl);
    res.send(pageTitle);
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem getting page title from ${req.url}: ${err}`
    );
    next(err);
  }
});

router.get('/page/:id/title/:title', async function(req, res, next) {
  try {
    const newPageTitle = await updatePageTitle(req.params.id, req.params.title);
    res.send(newPageTitle);
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem updating page title from ${req.url}: ${err}`
    );
    next(err);
  }
});

router.get('/importAll', async function(req, res, next) {
  try {
    await importAllFlailToStrapi();
    //res.send(newPageTitle);
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem importing static pages ${req.url}: ${err}`
    );
    next(err);
  }
});

router.get('/import/page/:relativeUrl', async function(req, res, next) {
  try {
    await importFlailPageToStrapi(req.params.relativeUrl);
    res.send('ok');
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem importing static page ${req.url}: ${err}`
    );
    next(err);
  }
});



router.get('/document/:docId', async function(req, res, next) {
  try {
    const doc = await getStrapiDocByDocId(req.params.docId);
    console.log('Strapi doc: ', doc);
    res.send(doc);
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem getting document ${req.params.docId} from ${req.url}: ${err}`
    );
    next(err);
  }
});

router.get('/source/:srcId', async function(req, res, next) {
  try {
    const src = await getStrapiSourceBySrcId(req.params.srcId);
    res.send(src);
  } catch (err) {
    winstonLogger.error(
      `[STRAPI] Problem getting source ${req.params.srcId} from ${req.url}: ${err}`
    );
    next(err);
  }
});

// add post new doc


module.exports = router;
