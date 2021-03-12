const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  const cameFrom = req.headers.referer;
  if (cameFrom) {
    req.session.redirectTo = cameFrom;
  }
  res.render('gw-login');
});

module.exports = router;
