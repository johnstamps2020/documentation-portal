const express = require('express');
const router = express.Router();

/* GET unauthorized page. */
router.get('/', function(req, res, next) {
  res.render('unauthorized');
});

module.exports = router;
