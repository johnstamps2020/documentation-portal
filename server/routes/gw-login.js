const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  if (req.originalUrl === '/gw-login' && req.headers.referer) {
    req.session.redirectTo = req.headers.referer;
  }
  res.render('gw-login');
});

module.exports = router;
