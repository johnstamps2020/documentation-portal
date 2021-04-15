const express = require('express');
const router = express.Router();
const { getRedirectUrl } = require('../controllers/404');

/* GET home page. */
router.get('/', function(req, res, next) {
  const cameFrom = req.headers.referer;
  const redirectUrl = getRedirectUrl(cameFrom);
  if (redirectUrl) {
    res.redirect(redirectUrl);
  } else {
    const pageInfo = {
      cameFrom: cameFrom,
      appBaseUrl: process.env.APP_BASE_URL,
    };
    res.render('404', { pageInfo });
  }
});

module.exports = router;
