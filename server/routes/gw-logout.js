const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  const cameFrom = req.headers.referer || '/';
  req.session.destroy(function(err) {
    if (err) {
      next(err);
    }
    res.redirect(cameFrom);
  });
});

module.exports = router;
