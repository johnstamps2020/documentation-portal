const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    req.session.destroy(function(err) {
      if (err) {
        next(err);
      }
      res.redirect('/');
    });
  } catch (err) {
    winstonLogger.error(
      `Problem logging out: ${JSON.stringify(err)}; REQ: ${JSON.stringify(req)}`
    );
    next(err);
  }
});

module.exports = router;
