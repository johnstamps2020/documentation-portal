const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    res.render('support');
  } catch (err) {
    winstonLogger.error(`Problem rendering the support page
        ERROR: ${err.message}
        REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
