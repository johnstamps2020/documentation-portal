const express = require('express');
const router = express.Router();
const {
  getConfig,
  getRootBreadcrumb,
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

module.exports = router;
