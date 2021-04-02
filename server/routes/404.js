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
    res.render('404');
  }
});

module.exports = router;
