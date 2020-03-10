var express = require('express');
var router = express.Router();

/* GET unauthorized page. */
router.get('/', function(req, res, next) {
  res.render('unauthorized');
});

module.exports = router;
