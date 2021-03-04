const express = require('express');
const router = express.Router();
const configIndexName = 'server-config';
const { getDocs } = require('../controllers/configController');

router.get('/', async function(req, res, next) {
  try {
    res.send('Try /config/docs');
  } catch (err) {
    next(err);
  }
});

router.get('/docs', async function(req, res, next) {
  try {
    const docs = await getDocs(
      {
        query: {
          match_all: {},
        },
      },
      configIndexName
    );
    res.send(docs);
  } catch (err) {
    next(err);
  }
});

router.get('/docs/findMany', async function(req, res, next) {
  try {
    const { product, platform, version } = req.query;
    const queryFields = [
      { match_phrase: { 'metadata.platform': platform } },
      { match_phrase: { 'metadata.product': product } },
    ];
    if (version) {
      queryFields.push({ match_phrase: { 'metadata.version': version } });
    }
    const docs = await getDocs(
      {
        query: {
          bool: {
            must: queryFields,
            must_not: [{ match: { displayOnLandingPages: 'false' } }],
          },
        },
      },
      configIndexName
    );
    res.send(docs);
  } catch (err) {
    next(err);
  }
});

router.get('/taxonomy/:release', async function(req, res) {
  const config = await getTaxonomy(req.params.release);
  res.send(config);
});

router.get('/versions/:product/:platform', async function(req, res) {
  const { product, platform } = req.params;
  const versions = await getVersionsForProductOnPlatform(
    product,
    platform,
    req.isAuthenticated()
  );
  res.send(versions);
});

module.exports = router;
