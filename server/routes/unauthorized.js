const express = require('express');
const router = express.Router();

/* GET unauthorized page. */
router.get('/', function(req, res, next) {
  const pageInfo = {
    cameFrom: req.headers.referer,
  };
  res.render('unauthorized', { pageInfo });
});

module.exports = router;
